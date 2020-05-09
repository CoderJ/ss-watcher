#!/bin/bash
netstat -na|grep ESTABLISHED|grep https|awk '{print $5}'|awk -F: '{print $1}'