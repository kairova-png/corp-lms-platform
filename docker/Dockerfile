# Воспроизводимый образ Moodle 4.5 LTS для on-prem развёртывания.
# Контекст сборки = корень репозитория (см. docker-compose.yml).
FROM php:8.3-apache

ARG MOODLE_BRANCH=MOODLE_405_STABLE

# Системные зависимости + расширения PHP, требуемые Moodle
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip rsync libpq-dev libpng-dev libjpeg-dev libfreetype6-dev \
        libzip-dev libicu-dev libxml2-dev libonig-dev cron \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" pgsql gd intl zip soap exif opcache \
    && pecl install redis && docker-php-ext-enable redis \
    && a2enmod rewrite headers \
    && rm -rf /var/lib/apt/lists/*

# Рекомендованные настройки PHP для Moodle
RUN { \
      echo 'max_input_vars=5000'; \
      echo 'memory_limit=256M'; \
      echo 'post_max_size=200M'; \
      echo 'upload_max_filesize=200M'; \
      echo 'opcache.enable=1'; \
      echo 'opcache.memory_consumption=128'; \
    } > /usr/local/etc/php/conf.d/moodle.ini

# Ядро Moodle (фиксированная LTS-ветка)
RUN git clone --depth 1 --branch "${MOODLE_BRANCH}" \
      https://github.com/moodle/moodle.git /var/www/html

# Конфиг (env-driven) и забандленные плагины (стейджатся install_plugins.sh)
COPY docker/config.php /var/www/html/config.php
COPY moodle/staged/ /var/www/html/

RUN mkdir -p /var/moodledata \
    && chown -R www-data:www-data /var/www/html /var/moodledata \
    && chmod 0775 /var/moodledata

EXPOSE 80
