# Publish this source repository

Recommended repository: `ati1993de/vargamesh-desktop`

On the VPS after extracting this source package:

```bash
cd /root/vargamesh-desktop

git init -b main
git add .
git commit -m "feat: initial VargaMesh Desktop v0.1.0"

gh repo create ati1993de/vargamesh-desktop \
  --public \
  --description "Secure Windows desktop wallet and full-node UI for VargaMesh" \
  --homepage "https://vargacoin.com" \
  --source . \
  --remote origin

# Use the existing dedicated GitHub SSH key for the push.
GIT_SSH_COMMAND='ssh -i /root/.ssh/id_ed25519_github_vargamesh -o IdentitiesOnly=yes' \
  git push -u origin main
```

Run the Windows workflow manually once. After the installer and portable artifact
have been tested on a normal Windows 11 system, publish the first desktop tag:

```bash
git tag -a v0.1.0 -m "VargaMesh Desktop v0.1.0"
GIT_SSH_COMMAND='ssh -i /root/.ssh/id_ed25519_github_vargamesh -o IdentitiesOnly=yes' \
  git push origin v0.1.0
```

The tag starts the workflow again and creates the GitHub pre-release only if the
Windows build succeeds.
