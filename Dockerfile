# Use a imagem oficial do Apache
FROM httpd:2.4

# Copie os arquivos do site para o diretório do Apache
COPY . /usr/local/apache2/htdocs/

# Configure o Apache para lidar com URLs amigáveis
RUN echo '\
<Directory "/usr/local/apache2/htdocs/">\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' >> /usr/local/apache2/conf/httpd.conf

# Exponha a porta 80
EXPOSE 80 