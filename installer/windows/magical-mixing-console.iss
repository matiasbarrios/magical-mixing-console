; Windows installer for the tinyjs build. Compile with `npm run tinyjs-installer`,
; which passes AppVersion and checks that dist/ exists. Needs Inno Setup 6.3+.

#ifndef AppVersion
  #error AppVersion is required: build with npm run tinyjs-installer
#endif

#define AppName "Magical Mixing Console"
#define AppExe "magical-mixing-console.exe"
#define RepoRoot "..\.."
#define DistDir RepoRoot + "\dist"

; Electron (Squirrel) installed per user here, named after package.json "name"
#define ElectronDir "{localappdata}\magical-mixing-console"

[Setup]
AppId={{904F120B-60CB-42AE-A5F3-67DA09FCF4B0}
AppName={#AppName}
AppVersion={#AppVersion}
AppVerName={#AppName} {#AppVersion}
AppPublisher=Magical Mixing Console
AppPublisherURL=https://magicalmixingconsole.com
AppSupportURL=https://magicalmixingconsole.com
PrivilegesRequired=lowest
DefaultDirName={autopf}\{#AppName}
DisableProgramGroupPage=yes
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
MinVersion=10.0
OutputDir={#DistDir}
OutputBaseFilename=magical-mixing-console-{#AppVersion}-windows-x64-setup
SetupIconFile={#RepoRoot}\assets\icon\icon.ico
UninstallDisplayIcon={app}\{#AppExe}
UninstallDisplayName={#AppName}
WizardStyle=modern
Compression=lzma2/max
SolidCompression=yes
ShowLanguageDialog=no
SetupLogging=yes

[Languages]
Name: "en"; MessagesFile: "compiler:Default.isl"
Name: "es"; MessagesFile: "compiler:Languages\Spanish.isl"

[CustomMessages]
en.ElectronReplaced=The previous version of Magical Mixing Console will be uninstalled first.
es.ElectronReplaced=Primero se desinstalará la versión anterior de Magical Mixing Console.
en.ElectronRemoving=Uninstalling the previous version...
es.ElectronRemoving=Desinstalando la versión anterior...
en.WebView2Required=Microsoft Edge WebView2 will be downloaded and installed.
es.WebView2Required=Se descargará e instalará Microsoft Edge WebView2.
en.WebView2Installing=Installing Microsoft Edge WebView2...
es.WebView2Installing=Instalando Microsoft Edge WebView2...
en.WebView2Missing=Magical Mixing Console needs Microsoft Edge WebView2, and it could not be installed automatically.%n%nDo you want to open the download page?
es.WebView2Missing=Magical Mixing Console necesita Microsoft Edge WebView2 y no se pudo instalar automáticamente.%n%n¿Quiere abrir la página de descarga?

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
; launcher.exe has to sit next to the app exe
Source: "{#DistDir}\*"; DestDir: "{app}"; Excludes: "*-setup.exe"; Flags: ignoreversion recursesubdirs createallsubdirs
Source: "{#RepoRoot}\LICENSE"; DestDir: "{app}"; DestName: "LICENSE.txt"; Flags: ignoreversion

[Icons]
Name: "{autoprograms}\{#AppName}"; Filename: "{app}\{#AppExe}"
Name: "{autodesktop}\{#AppName}"; Filename: "{app}\{#AppExe}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#AppExe}"; Description: "{cm:LaunchProgram,{#AppName}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
; Cache and logs only; settings and vaults in %APPDATA% are kept
Type: filesandordirs; Name: "{localappdata}\com.magicalmixing.console"

[Code]
const
  WebView2ClientKey = 'SOFTWARE\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}';
  WebView2BootstrapperUrl = 'https://go.microsoft.com/fwlink/p/?LinkId=2124703';
  WebView2BootstrapperFile = 'MicrosoftEdgeWebview2Setup.exe';
  WebView2DownloadPage = 'https://developer.microsoft.com/microsoft-edge/webview2/';

var
  DownloadPage: TDownloadWizardPage;
  WebView2Downloaded: Boolean;

// Per-machine installs register under the 32-bit view, per-user ones under HKCU
function WebView2VersionValid(RootKey: Integer): Boolean;
var
  Version: String;
begin
  Result := RegQueryStringValue(RootKey, WebView2ClientKey, 'pv', Version)
    and (Version <> '') and (Version <> '0.0.0.0');
end;

function WebView2Installed: Boolean;
begin
  Result := WebView2VersionValid(HKLM32) or WebView2VersionValid(HKCU);
end;

// Non-elevated, the Evergreen bootstrapper installs WebView2 for the current user
procedure WebView2Install;
var
  ResultCode: Integer;
begin
  if not WebView2Downloaded then Exit;
  WizardForm.StatusLabel.Caption := CustomMessage('WebView2Installing');
  if Exec(ExpandConstant('{tmp}\' + WebView2BootstrapperFile), '/silent /install', '',
      SW_HIDE, ewWaitUntilTerminated, ResultCode) then
    Log(Format('WebView2 bootstrapper exit code: %d', [ResultCode]))
  else
    Log('WebView2 bootstrapper could not start');
end;

procedure WebView2Warn;
var
  ErrorCode: Integer;
begin
  if SuppressibleMsgBox(CustomMessage('WebView2Missing'), mbConfirmation, MB_YESNO, IDNO) = IDYES then
    ShellExec('open', WebView2DownloadPage, '', '', SW_SHOWNORMAL, ewNoWait, ErrorCode);
end;

function ElectronUpdateExe: String;
begin
  Result := ExpandConstant('{#ElectronDir}\Update.exe');
end;

function ElectronInstalled: Boolean;
begin
  Result := FileExists(ElectronUpdateExe);
end;

// Squirrel removes its app folder and shortcuts; Electron's data in %APPDATA% stays
procedure ElectronUninstall;
var
  ResultCode: Integer;
begin
  if not ElectronInstalled then Exit;
  WizardForm.StatusLabel.Caption := CustomMessage('ElectronRemoving');
  if Exec(ElectronUpdateExe, '--uninstall -s', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
    Log(Format('Squirrel uninstall exit code: %d', [ResultCode]))
  else
    Log('Squirrel uninstall could not start');
end;

procedure InitializeWizard;
begin
  DownloadPage := CreateDownloadPage(SetupMessage(msgWizardPreparing), SetupMessage(msgPreparingDesc), nil);
end;

function NextButtonClick(CurPageID: Integer): Boolean;
begin
  Result := True;
  if (CurPageID <> wpReady) or WebView2Installed then Exit;

  DownloadPage.Clear;
  DownloadPage.Add(WebView2BootstrapperUrl, WebView2BootstrapperFile, '');
  DownloadPage.Show;
  try
    try
      DownloadPage.Download;
      WebView2Downloaded := True;
    except
      Log('WebView2 download failed: ' + GetExceptionMessage);
    end;
  finally
    DownloadPage.Hide;
  end;
end;

function UpdateReadyMemo(Space, NewLine, MemoUserInfoInfo, MemoDirInfo, MemoTypeInfo,
  MemoComponentsInfo, MemoGroupInfo, MemoTasksInfo: String): String;
begin
  Result := MemoDirInfo;
  if MemoTasksInfo <> '' then
    Result := Result + NewLine + NewLine + MemoTasksInfo;
  if ElectronInstalled then
    Result := Result + NewLine + NewLine + CustomMessage('ElectronReplaced');
  if not WebView2Installed then
    Result := Result + NewLine + NewLine + CustomMessage('WebView2Required');
end;

procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssInstall then
    ElectronUninstall
  else if CurStep = ssPostInstall then
  begin
    if not WebView2Installed then
      WebView2Install;
    if not WebView2Installed then
      WebView2Warn;
  end;
end;
