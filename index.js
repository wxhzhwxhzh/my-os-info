#!/usr/bin/env node

import os from "os";
import chalk from "chalk";
import { Command } from "commander";

const program = new Command();

const now = new Date().toLocaleString();

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

program
  .name("myinfo")
  .description("Print current system time and IP address")
  .option("--json", "输出 JSON 格式")
  .option("--time-only", "只输出时间")
  .option("--ip-only", "只输出 IP 地址")
  .parse(process.argv);

const options = program.opts();
const ip = getLocalIP();

if (options.json) {
  const data = {
    time: now,
    ip: ip || "Not found"
  };
  console.log(JSON.stringify(data, null, 2));
} else {
  if (options.timeOnly) {
    console.log(`${chalk.blue("🕒 当前时间：")} ${chalk.white(now)}`);
  } else if (options.ipOnly) {
    if (ip) {
      console.log(`${chalk.green("🌐 本机 IP：")} ${chalk.white(ip)}`);
    } else {
      console.log(chalk.red("无法获取本机 IP 地址"));
    }
  } else {
    console.log(`${chalk.blue("🕒 当前时间：")} ${chalk.white(now)}`);
    if (ip) {
      console.log(`${chalk.green("🌐 本机 IP：")} ${chalk.white(ip)}`);
    } else {
      console.log(chalk.red("无法获取本机 IP 地址"));
    }
  }
}
