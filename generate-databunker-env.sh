#!/bin/sh
KEY=`< /dev/urandom LC_CTYPE=C tr -dc 'a-f0-9' | head -c${1:-48};`
echo 'DATABUNKER_MASTERKEY='$KEY > databunker.env
