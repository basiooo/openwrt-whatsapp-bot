#!/bin/bash
#Source https://github.com/helmiau/PHPTeleBotWrt/blob/master/src/plugins/getinitapp.sh
datainit=$(ls -l /etc/init.d | awk '{print$9}')
for i in $datainit; do
	if grep -q 'start' "/etc/init.d/$i"; then
		echo -e "➜ $i"
	fi
done