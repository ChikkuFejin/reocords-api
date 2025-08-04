#!/bin/bash

NAME=$1

if [ -z "$NAME" ]; then
  echo "❌ Please provide a name. Example: ./generate-basic.sh user"
  exit 1
fi

nest g module modules/$NAME
nest g controller modules/$NAME
nest g service $NAME
nest g class modules/$NAME/entities/${NAME}.entity
nest g class modules/$NAME/dto/create-${NAME}.dto
nest g class modules/$NAME/dto/update-${NAME}.dto

echo "✅ Basic structure generated for '$NAME'"