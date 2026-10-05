// Anatomia 3D — lançador local com atualização automática.
//
// O atlas (HTML + JS) vai embutido neste .exe como um zip. Ao abrir:
//   1. garante que a versão embutida esteja instalada em %LOCALAPPDATA%\Anatomia3D\app-<versão>;
//   2. consulta a última release do GitHub (version.json); se houver versão mais nova, baixa o app.zip,
//      confere o SHA-256 e instala. Sem internet, segue com a versão instalada;
//   3. se o próprio lançador mudou, troca o .exe (o novo vale a partir da próxima abertura);
//   4. abre o atlas numa janela própria do Edge (ou Chrome), sem barra de endereço.
//
// Parâmetros: --sem-atualizar · --extrair (não abre o navegador; para testes) · --fonte=<url base> (testes)
using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.IO.Compression;
using System.Net;
using System.Net.Cache;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Windows.Forms;
using Microsoft.Win32;

static class Launcher
{
    const string AppName = "Anatomia 3D";
    const string UserAgent = "Anatomia3D-Launcher";
    static string Root;
    static string Source; // url base alternativa (testes)

    [STAThread]
    static int Main(string[] args)
    {
        Root = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Anatomia3D");
        bool onlyExtract = Has(args, "--extrair");
        bool noUpdate = Has(args, "--sem-atualizar");
        foreach (var a in args) if (a.StartsWith("--fonte=")) Source = a.Substring(8).TrimEnd('/') + "/";

        // duas aberturas simultâneas não podem instalar ao mesmo tempo
        using (var mutex = new Mutex(false, "Anatomia3D-Lancador"))
        {
            bool owned = false;
            try
            {
                try { owned = mutex.WaitOne(TimeSpan.FromSeconds(60)); }
                catch (AbandonedMutexException) { owned = true; }

                Directory.CreateDirectory(Root);
                Application.EnableVisualStyles();
                RemoveOldExe();

                string version = EnsureInstalled();
                if (!noUpdate)
                {
                    string newer = CheckForUpdate(version);
                    if (newer != null) version = newer;
                }
                RemoveOldVersions(version);

                string index = Path.Combine(AppDir(version), "index.html");
                if (onlyExtract)
                {
                    File.WriteAllText(Path.Combine(Root, "ultima-extracao.txt"), index);
                    return 0;
                }
                return OpenBrowser(index);
            }
            catch (Exception ex)
            {
                Log("erro: " + ex);
                MessageBox.Show("Não foi possível abrir o " + AppName + ".\n\n" + ex.Message, AppName, MessageBoxButtons.OK, MessageBoxIcon.Error);
                return 2;
            }
            finally
            {
                if (owned) mutex.ReleaseMutex();
            }
        }
    }

    static bool Has(string[] args, string flag) { return Array.IndexOf(args, flag) >= 0; }

    /* ───────────── Instalação local ───────────── */

    static string AppDir(string version) { return Path.Combine(Root, "app-" + version); }

    /// <summary>Versão registrada em current.txt, se a pasta dela estiver íntegra.</summary>
    static string InstalledVersion()
    {
        try
        {
            string v = File.ReadAllText(Path.Combine(Root, "current.txt")).Trim();
            return File.Exists(Path.Combine(AppDir(v), "index.html")) ? v : null;
        }
        catch { return null; }
    }

    /// <summary>Instala a versão embutida no .exe quando não há nada instalado ou quando ela é mais nova.</summary>
    static string EnsureInstalled()
    {
        string installed = InstalledVersion();
        if (installed != null && Compare(installed, BuildInfo.Version) >= 0) return installed;
        var asm = Assembly.GetExecutingAssembly();
        using (var rs = asm.GetManifestResourceStream("app.zip"))
        using (var ms = new MemoryStream())
        {
            rs.CopyTo(ms);
            Install(ms.ToArray(), BuildInfo.Version);
        }
        Log("versão embutida instalada: " + BuildInfo.Version);
        return BuildInfo.Version;
    }

    static void Install(byte[] zip, string version)
    {
        string dir = AppDir(version);
        string tmp = dir + ".tmp";
        if (Directory.Exists(tmp)) Directory.Delete(tmp, true);
        Directory.CreateDirectory(tmp);
        string tmpFull = Path.GetFullPath(tmp) + Path.DirectorySeparatorChar;
        using (var ms = new MemoryStream(zip))
        using (var za = new ZipArchive(ms, ZipArchiveMode.Read))
        {
            foreach (var entry in za.Entries)
            {
                if (string.IsNullOrEmpty(entry.Name)) continue; // pasta
                string dest = Path.GetFullPath(Path.Combine(tmp, entry.FullName.Replace('/', Path.DirectorySeparatorChar)));
                if (!dest.StartsWith(tmpFull, StringComparison.OrdinalIgnoreCase)) continue; // caminho fora da pasta
                Directory.CreateDirectory(Path.GetDirectoryName(dest));
                using (var s = entry.Open())
                using (var f = File.Create(dest))
                    s.CopyTo(f);
            }
        }
        if (!File.Exists(Path.Combine(tmp, "index.html"))) throw new InvalidDataException("pacote sem index.html");
        if (Directory.Exists(dir)) Directory.Delete(dir, true);
        Directory.Move(tmp, dir);
        string cur = Path.Combine(Root, "current.txt");
        File.WriteAllText(cur + ".tmp", version);
        if (File.Exists(cur)) File.Delete(cur);
        File.Move(cur + ".tmp", cur);
    }

    static void RemoveOldVersions(string keep)
    {
        foreach (var d in Directory.GetDirectories(Root, "app-*"))
        {
            if (string.Equals(Path.GetFileName(d), "app-" + keep, StringComparison.OrdinalIgnoreCase)) continue;
            try { Directory.Delete(d, true); } catch { /* em uso: fica para a próxima */ }
        }
    }

    /* ───────────── Atualização ───────────── */

    static string ManifestUrl()
    {
        return Source != null ? Source + "version.json" : "https://github.com/" + BuildInfo.Repo + "/releases/latest/download/version.json";
    }

    static string AssetUrl(string version, string name)
    {
        return Source != null ? Source + name : "https://github.com/" + BuildInfo.Repo + "/releases/download/v" + version + "/" + name;
    }

    /// <summary>Consulta a última release; devolve a versão instalada agora (ou null se nada mudou).</summary>
    static string CheckForUpdate(string installed)
    {
        ServicePointManager.SecurityProtocol |= (SecurityProtocolType)3072; // TLS 1.2
        if (WebRequest.DefaultWebProxy != null) WebRequest.DefaultWebProxy.Credentials = CredentialCache.DefaultNetworkCredentials;

        // a consulta roda em segundo plano com prazo curto, para não atrasar a abertura sem internet
        string manifest = null;
        Exception error = null;
        var t = new Thread(() =>
        {
            try { manifest = GetString(ManifestUrl(), 6000); }
            catch (Exception ex) { error = ex; }
        });
        t.IsBackground = true;
        t.Start();
        if (!t.Join(7000) || manifest == null)
        {
            Log("sem acesso à atualização (" + (error != null ? error.Message : "tempo esgotado") + "); usando " + installed);
            return null;
        }

        string latest = JsonValue(manifest, "version");
        if (latest == null) { Log("version.json inválido"); return null; }

        string result = null;
        if (Compare(latest, installed) > 0)
        {
            try
            {
                byte[] zip = DownloadWithProgress(AssetUrl(latest, JsonValue(manifest, "app") ?? "app.zip"),
                    "Baixando a versão " + latest + "…");
                if (zip == null) { Log("download da versão " + latest + " cancelado"); return null; }
                CheckHash(zip, JsonValue(manifest, "appSha256"));
                Install(zip, latest);
                Log("atualizado de " + installed + " para " + latest);
                result = latest;
            }
            catch (Exception ex)
            {
                Log("falha ao atualizar para " + latest + ": " + ex.Message);
                MessageBox.Show("Não foi possível baixar a versão " + latest + ". O " + AppName + " vai abrir na versão " + installed + ".\n\n" + ex.Message,
                    AppName, MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return null;
            }
        }
        else Log("versão " + installed + " já é a mais recente");

        string launcher = JsonValue(manifest, "launcher");
        if (launcher != null && launcher != BuildInfo.LauncherHash) UpdateSelf(manifest, latest);
        return result;
    }

    /// <summary>Troca o próprio .exe pelo da release (um .exe em uso pode ser renomeado, não sobrescrito).</summary>
    static void UpdateSelf(string manifest, string latest)
    {
        string exe = Assembly.GetExecutingAssembly().Location;
        string tmp = exe + ".novo";
        try
        {
            byte[] data = DownloadWithProgress(AssetUrl(latest, JsonValue(manifest, "exe") ?? "Anatomia3D.exe"), "Atualizando o programa…");
            if (data == null) return;
            CheckHash(data, JsonValue(manifest, "exeSha256"));
            File.WriteAllBytes(tmp, data);
            string old = exe + ".antigo";
            if (File.Exists(old)) File.Delete(old);
            File.Move(exe, old);
            File.SetAttributes(old, FileAttributes.Hidden);
            File.Move(tmp, exe);
            Log("lançador atualizado para o da versão " + latest);
        }
        catch (Exception ex)
        {
            Log("não foi possível atualizar o lançador: " + ex.Message);
            try { if (File.Exists(tmp)) File.Delete(tmp); } catch { }
        }
    }

    static void RemoveOldExe()
    {
        try
        {
            string old = Assembly.GetExecutingAssembly().Location + ".antigo";
            if (File.Exists(old)) { File.SetAttributes(old, FileAttributes.Normal); File.Delete(old); }
        }
        catch { }
    }

    static void CheckHash(byte[] data, string expected)
    {
        if (string.IsNullOrEmpty(expected)) return;
        string got;
        using (var sha = SHA256.Create())
            got = BitConverter.ToString(sha.ComputeHash(data)).Replace("-", "");
        if (!got.Equals(expected, StringComparison.OrdinalIgnoreCase))
            throw new InvalidDataException("o arquivo baixado está corrompido (SHA-256 diferente).");
    }

    static string GetString(string url, int timeoutMs)
    {
        var req = (HttpWebRequest)WebRequest.Create(url);
        req.UserAgent = UserAgent;
        req.Timeout = timeoutMs;
        req.ReadWriteTimeout = timeoutMs;
        req.AllowAutoRedirect = true;
        req.CachePolicy = new RequestCachePolicy(RequestCacheLevel.NoCacheNoStore);
        using (var resp = req.GetResponse())
        using (var sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8))
            return sr.ReadToEnd();
    }

    /// <summary>Baixa mostrando uma janela de progresso. Devolve null se a pessoa pular.</summary>
    static byte[] DownloadWithProgress(string url, string title)
    {
        byte[] result = null;
        Exception error = null;
        using (var form = new ProgressForm(title))
        using (var wc = new WebClient())
        {
            wc.Headers[HttpRequestHeader.UserAgent] = UserAgent;
            wc.CachePolicy = new RequestCachePolicy(RequestCacheLevel.NoCacheNoStore);
            DateTime last = DateTime.UtcNow;
            wc.DownloadProgressChanged += (s, e) => { last = DateTime.UtcNow; form.SetProgress(e.BytesReceived, e.TotalBytesToReceive); };
            wc.DownloadDataCompleted += (s, e) =>
            {
                if (form.IsDisposed) return; // chegou depois de a pessoa pular
                if (!e.Cancelled)
                {
                    if (e.Error != null) error = e.Error; else result = e.Result;
                }
                form.Done = true;
                form.Close();
            };
            // sem progresso por 60 s: desiste
            var watchdog = new System.Windows.Forms.Timer { Interval = 1000 };
            watchdog.Tick += (s, e) => { if ((DateTime.UtcNow - last).TotalSeconds > 60 && wc.IsBusy) { error = new TimeoutException("a conexão parou de responder."); wc.CancelAsync(); } };
            form.Shown += (s, e) => { watchdog.Start(); wc.DownloadDataAsync(new Uri(url)); };
            form.FormClosing += (s, e) => { if (!form.Done && wc.IsBusy) wc.CancelAsync(); };
            Application.Run(form);
            watchdog.Stop();
        }
        if (error != null) throw error;
        return result;
    }

    static string JsonValue(string json, string key)
    {
        var m = Regex.Match(json, "\"" + Regex.Escape(key) + "\"\\s*:\\s*\"([^\"]*)\"");
        return m.Success ? m.Groups[1].Value : null;
    }

    static int Compare(string a, string b)
    {
        Version va, vb;
        if (!Version.TryParse(a, out va)) va = new Version(0, 0);
        if (!Version.TryParse(b, out vb)) vb = new Version(0, 0);
        return va.CompareTo(vb);
    }

    static void Log(string msg)
    {
        try
        {
            string path = Path.Combine(Root, "atualizacao.log");
            if (File.Exists(path) && new FileInfo(path).Length > 200000) File.Delete(path);
            File.AppendAllText(path, DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "  " + msg + Environment.NewLine);
        }
        catch { }
    }

    /* ───────────── Navegador ───────────── */

    static int OpenBrowser(string index)
    {
        string browser = FindBrowser();
        if (browser == null)
        {
            MessageBox.Show(
                "Para abrir o " + AppName + " é preciso ter o Microsoft Edge ou o Google Chrome instalado.\n\n" +
                "O Edge já vem com o Windows 10 e 11. Se ele foi removido, instale o Edge ou o Chrome e abra este programa novamente.",
                AppName, MessageBoxButtons.OK, MessageBoxIcon.Information);
            return 1;
        }
        string url = new Uri(index).AbsoluteUri;
        string profile = Path.Combine(Root, "perfil");
        string arguments =
            "--app=\"" + url + "\" " +
            "--user-data-dir=\"" + profile + "\" " +
            "--no-first-run --no-default-browser-check --window-size=1440,900 " +
            "--disable-features=Translate,msEdgeSidebar --disable-extensions";
        Process.Start(new ProcessStartInfo(browser, arguments) { UseShellExecute = false });
        return 0;
    }

    static string FindBrowser()
    {
        string pf = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
        string pf86 = Environment.GetEnvironmentVariable("ProgramFiles(x86)");
        string local = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        string[] candidates =
        {
            Path.Combine(pf86 ?? pf, @"Microsoft\Edge\Application\msedge.exe"),
            Path.Combine(pf, @"Microsoft\Edge\Application\msedge.exe"),
            Path.Combine(pf, @"Google\Chrome\Application\chrome.exe"),
            Path.Combine(pf86 ?? pf, @"Google\Chrome\Application\chrome.exe"),
            Path.Combine(local, @"Google\Chrome\Application\chrome.exe"),
        };
        foreach (var c in candidates) if (File.Exists(c)) return c;

        foreach (var name in new[] { "msedge.exe", "chrome.exe" })
        {
            foreach (var hive in new[] { Registry.LocalMachine, Registry.CurrentUser })
            {
                try
                {
                    using (var k = hive.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\" + name))
                    {
                        var p = k == null ? null : k.GetValue(null) as string;
                        if (!string.IsNullOrEmpty(p) && File.Exists(p)) return p;
                    }
                }
                catch { }
            }
        }
        return null;
    }
}

/// <summary>Janela pequena com a barra de progresso do download.</summary>
sealed class ProgressForm : Form
{
    readonly Label status;
    readonly ProgressBar bar;
    public bool Done;

    public ProgressForm(string title)
    {
        Text = "Anatomia 3D";
        FormBorderStyle = FormBorderStyle.FixedDialog;
        MaximizeBox = false;
        MinimizeBox = false;
        StartPosition = FormStartPosition.CenterScreen;
        ClientSize = new Size(420, 118);
        Font = new Font("Segoe UI", 9.5f);
        try { Icon = Icon.ExtractAssociatedIcon(Application.ExecutablePath); } catch { }

        var head = new Label { Text = title, AutoSize = false, Location = new Point(16, 14), Size = new Size(388, 22), Font = new Font("Segoe UI", 10.5f, FontStyle.Bold) };
        status = new Label { Text = "Conectando…", AutoSize = false, Location = new Point(16, 40), Size = new Size(388, 20), ForeColor = Color.DimGray };
        bar = new ProgressBar { Location = new Point(16, 64), Size = new Size(296, 18), Minimum = 0, Maximum = 1000, Style = ProgressBarStyle.Continuous };
        var skip = new Button { Text = "Pular", Location = new Point(324, 60), Size = new Size(80, 26) };
        skip.Click += (s, e) => Close();
        var note = new Label { Text = "Ao pular, o atlas abre na versão já instalada.", AutoSize = false, Location = new Point(16, 92), Size = new Size(388, 18), ForeColor = Color.Gray, Font = new Font("Segoe UI", 8.5f) };
        Controls.AddRange(new Control[] { head, status, bar, skip, note });
    }

    public void SetProgress(long received, long total)
    {
        if (total > 0)
        {
            bar.Value = (int)Math.Min(1000, received * 1000 / total);
            status.Text = string.Format("{0:0.0} de {1:0.0} MB", received / 1048576.0, total / 1048576.0);
        }
        else status.Text = string.Format("{0:0.0} MB", received / 1048576.0);
    }
}
