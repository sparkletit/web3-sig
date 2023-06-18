# STATUS=$("whoami")
# echo $?
# echo $STATUS
/usr/bin/docker exec webpacketnode sh -c "yarn build"
if [ $? -eq 0 ]; then
    pwd
    if [ ! -d "./dist" ]; then
        mkdir dist
    fi

cd dist
rm -rf *
cp -R ../../storage/webpacket_site/build/server/pages/*.* ./
mkdir ./_next
cp -R ../../storage/webpacket_site/build/static ./_next
cd ..
tar czvf dist.tar.gz ./dist
else
    echo fail
    exit 255  # exit code must be unsigned short
fi
