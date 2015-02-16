cd /tmp

# try to remove the repo if it already exists
rm -rf fermi-backend; true

git clone https://github.com/OAGr/fermi-backend.git

cd fermi-backend

npm install

node .
