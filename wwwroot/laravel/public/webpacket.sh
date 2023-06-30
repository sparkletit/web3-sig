rm -rf dist*
/usr/bin/docker exec webpacketnode sh -c "yarn build"
if [ $? -eq 0 ]; then
    pwd
    if [ ! -d "./dist" ]; then
        mkdir dist
    fi

cd dist
rm -rf *
cp -R  /var/www/html/laravel/storage/webpacket_site/build/server/pages/*.* ./
cp -R  /var/www/html/laravel/storage/webpacket_site/page_content.html ./
mkdir ./_next
cp -R  /var/www/html/laravel/storage/webpacket_site/build/static ./_next
#cd ..
#pwd
zip -r ../dist_$1.zip *

else
    echo fail
    exit 255  # exit code must be unsigned short
fi
