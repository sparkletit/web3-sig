FROM phpmyadmin/phpmyadmin:latest

RUN echo "\
file_uploads = On\n \
memory_limit = 512M\n \
upload_max_filesize = 512M\n \
post_max_size = 512M\n \
max_execution_time = 600\n \
max_input_vars = 3600\n \
" > /usr/local/etc/php/conf.d/uploads.ini
