# Beehind Studio - Piattaforma Gestione Task

Piattaforma collaborativa per la gestione di task, pagamenti clienti e spese ufficio per Beehind Studio.

## 🚀 Deploy su Vercel

### Prerequisiti
- Un account GitHub gratuito
- Un account Vercel gratuito

### Istruzioni Passo-Passo

#### 1. Crea un Account GitHub
1. Vai su [github.com](https://github.com)
2. Clicca su "Sign up" (Registrati)
3. Inserisci email, password e username
4. Verifica la tua email

#### 2. Carica il Progetto su GitHub
1. Accedi a GitHub
2. Clicca sul pulsante "+" in alto a destra
3. Seleziona "New repository" (Nuovo repository)
4. Dai un nome: `beehind-studio-platform`
5. Seleziona "Public" (Pubblico)
6. Clicca "Create repository"
7. **NON** inizializzare con README

8. Nella tua cartella del progetto, apri il terminale e digita:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/beehind-studio-platform.git
git push -u origin main
```

(Sostituisci TUO-USERNAME con il tuo username GitHub)

#### 3. Deploy con Vercel
1. Vai su [vercel.com](https://vercel.com)
2. Clicca "Sign Up" (Registrati)
3. Scegli "Continue with GitHub"
4. Autorizza Vercel ad accedere a GitHub
5. Clicca "Import Project"
6. Trova il repository `beehind-studio-platform`
7. Clicca "Import"
8. Vercel rileverà automaticamente che è un progetto Vite
9. Clicca "Deploy"
10. Aspetta 2-3 minuti

#### 4. Ottieni il Link
- Dopo il deploy, Vercel ti mostrerà un link tipo: `beehind-studio-platform.vercel.app`
- Condividi questo link con i tuoi soci!

### 🔄 Aggiornare la Piattaforma
Ogni volta che modifichi il codice:
```bash
git add .
git commit -m "Descrizione modifiche"
git push
```
Vercel aggiornerà automaticamente il sito!

## ⚠️ Note Importanti
- I dati sono condivisi tra tutti gli utenti
- Le modifiche di un socio sono visibili immediatamente agli altri
- Non serve autenticazione - chiunque abbia il link può accedere

## 🆘 Problemi Comuni

### "git not found"
Devi installare Git:
- Windows: [git-scm.com](https://git-scm.com)
- Mac: apri Terminal e digita `git` (si installerà automaticamente)

### "permission denied"
Devi configurare le credenziali GitHub:
```bash
git config --global user.name "Tuo Nome"
git config --global user.email "tua-email@example.com"
```

### Il sito non si aggiorna
1. Controlla su GitHub che il codice sia stato caricato
2. Vai su Vercel → Deployments
3. Guarda se ci sono errori
