# Use a imagem oficial do Apache
FROM httpd:2.4

# Instalar ferramentas necessárias
RUN apt-get update && apt-get install -y \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Habilitar módulos necessários
RUN sed -i \
    -e 's/^#\(LoadModule rewrite_module modules\/mod_rewrite.so\)/\1/' \
    -e 's/^#\(LoadModule deflate_module modules\/mod_deflate.so\)/\1/' \
    -e 's/^#\(LoadModule expires_module modules\/mod_expires.so\)/\1/' \
    conf/httpd.conf

# Configurar o Apache
RUN echo '\
<Directory "/usr/local/apache2/htdocs/">\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    DirectoryIndex index.html\n\
</Directory>\n\
\n\
<FilesMatch "\.html$">\n\
    Header set Cache-Control "no-cache"\n\
</FilesMatch>\n\
\n\
ServerName localhost\n\
' >> /usr/local/apache2/conf/httpd.conf

# Habilitar módulo headers
RUN sed -i \
    -e 's/^#\(LoadModule headers_module modules\/mod_headers.so\)/\1/' \
    conf/httpd.conf

# Copie os arquivos do site para o diretório do Apache
COPY . /usr/local/apache2/htdocs/

# Ajuste as permissões
RUN chown -R www-data:www-data /usr/local/apache2/htdocs/

# Exponha a porta 80
EXPOSE 80 