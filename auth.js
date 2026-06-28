(function () {
  const config = window.KATSARAS_SUPABASE || {};
  const hasSupabaseConfig = Boolean(config.url && config.anonKey && window.supabase);
  const authShell = document.querySelector("#auth-shell");
  const appShell = document.querySelector("#app-shell");
  const authForm = document.querySelector("#auth-form");
  const authError = document.querySelector("#auth-error");
  const signOutButton = document.querySelector("#sign-out-btn");
  const storageModeNote = document.querySelector("#storage-mode-note");

  window.katsarasAuth = {
    client: null,
    configured: hasSupabaseConfig,
    user: null
  };

  if (!hasSupabaseConfig) {
    document.body.classList.add("demo-mode");
    authShell.hidden = true;
    appShell.hidden = false;
    if (storageModeNote) {
      storageModeNote.textContent = "Demo-Modus: Daten bleiben nur in diesem Browser.";
    }
    window.dispatchEvent(new CustomEvent("katsaras-auth-ready", { detail: window.katsarasAuth }));
    return;
  }

  const client = window.supabase.createClient(config.url, config.anonKey);
  window.katsarasAuth.client = client;
  document.body.classList.add("auth-enabled");
  appShell.hidden = true;

  client.auth.getSession().then(({ data }) => {
    applySession(data.session);
  });

  client.auth.onAuthStateChange((_event, session) => {
    applySession(session);
  });

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    authError.textContent = "";
    const form = new FormData(authForm);
    const { error } = await client.auth.signInWithPassword({
      email: String(form.get("email")).trim(),
      password: String(form.get("password")).trim()
    });
    if (error) {
      authError.textContent = authMessage(error);
    }
  });

  signOutButton?.addEventListener("click", () => {
    client.auth.signOut();
  });

  function applySession(session) {
    window.katsarasAuth.user = session?.user || null;
    const signedIn = Boolean(session?.user);
    authShell.hidden = signedIn;
    appShell.hidden = !signedIn;
    if (signOutButton) signOutButton.hidden = !signedIn;
    if (storageModeNote) {
      storageModeNote.textContent = signedIn
        ? `Angemeldet als ${session.user.email}`
        : "Bitte anmelden, um Patientendaten zu öffnen.";
    }
    window.dispatchEvent(new CustomEvent("katsaras-auth-ready", { detail: window.katsarasAuth }));
  }

  function authMessage(error) {
    const message = error?.message || "";
    if (message.toLowerCase().includes("email not confirmed")) {
      return "E-Mail ist noch nicht bestätigt. Bitte den Benutzer in Supabase bestätigen oder E-Mail-Bestätigung deaktivieren.";
    }
    if (message.toLowerCase().includes("invalid login credentials")) {
      return "Falsche Zugangsdaten. Bitte E-Mail und Passwort genau prüfen.";
    }
    return `Anmeldung fehlgeschlagen: ${message}`;
  }
})();
