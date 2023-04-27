#!/bin/sh
# Source https://github.com/helmiau/PHPTeleBotWrt/blob/master/src/plugins/fwlist.sh
old=$IFS
IFS=$'\n'
TOTAL=0

echo "*Firewall Rules*"

for rule in $(uci -q show firewall  | grep "@rule" )
do
	line=$(echo ${rule} | awk -F "." '{print $3}')
	id=$(echo ${rule} | grep ".name" | grep -oE "\[[[:digit:]]+\]" | awk '{gsub("\\[|]","");printf $1}')
	if [ "$id" != "" ]; then
		echo "id: $id"
	fi
	new=${line//\'/}
	new2=${new//_/\\_}
	new3=${new2//=/: }
	echo ${new3//\*/all}
done
IFS=$old