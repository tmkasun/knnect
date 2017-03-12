#!/usr/bin/env bash
branch="tornado-backend"

echo "Deploying for production..."
git status
git pull origin ${branch}
webpack --context ./map_system/static/map_system/local/libraries/  --config ./map_system/static/map_system/local/libraries/webpack.config.js
python3.5 manage.py collectstatic --noinput -i node_modules
sudo systemctl restart apache2.service
echo "All done"