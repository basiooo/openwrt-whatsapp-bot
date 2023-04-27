# OpenWrt Whatsapp Bot
> Whatsapp bot for OpenWrt


## </> Commands List
| Command             | Description                    | Scrennshot                              |
|---------------------|--------------------------------|-----------------------------------------|
| `/menu`             | Show command list              |![](./screenshots/menu.png)|
| `/my_ip`            | Show ip address info           |![](./screenshots/my_ip.png)|
| `/sidompul 089***`  | Show MyXl info                 |![](./screenshots/sidompul.png)|
| `/sysinfo `         | Show system information        |![](./screenshots/sysinfo.png)|
| `/init_app`         | Show Initial App               |![](./screenshots/init_app.png)|
| `/reboot`           | Reboot OpenWrt device          |no screenshot|
| `/shutdown`         | Shutdown OpenWrt device        |no screenshot|
| `/firewall_rules`   | Show firewall rules            |![](./screenshots/firewall_rules.png)|
| `/interfaces`       | Show Network interfaces        |![](./screenshots/interfaces.png)|
| `/openclash_info`   | Show Openclash information     |![](./screenshots/openclash_info.png)|
| `/openclash_proxies`| Show Openclash proxies status  |![](./screenshots/openclash_proxies.png)|
| `/libernet_info`    | Show Libernet information      |![](./screenshots/libernet_info.png)|

## 📦 Requirements
- Node JS v14.21.3  or later
- NPM

## ⚙️ Installation
### Install from Terminal
- Update OpenWrt repo
  ``` sh 
  opkg update
  ```
- Install git
  ``` sh
  opkg install git
  ```
- Install Node and NPM
  ``` sh
  opkg install node-npm
  ```
- Clone Project
  ``` sh
  git clone https://github.com/basiooo/openwrt-whatsapp-bot.git
  ```
- Open Project Directory
  ``` sh
  cd openwrt-whatsapp-bot
  ```
- Install Node packages
  ``` sh
  npm install
  ```

## 🚀 Usage
### StartBot in background using `pm2`
- install `pm2` globaly
  ``` sh
  npm i pm2@latest -g
  ```
- start bot
  ``` sh
  pm2 start app.js --watch
  ```
- show `pm2` logs
  ``` sh
  pm2 logs
  ```

### Scan QrCode
- open `pm2` logs
  ``` sh
  pm2 logs
  ```
- scan QrCode inside the logs
- exit pm2 log using ctrl+c