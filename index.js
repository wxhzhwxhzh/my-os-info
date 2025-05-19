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

// 获取系统信息
function getOSInfo() {
    return {
        platform: os.platform(),
        release: os.release(),
        arch: os.arch(),
        type: os.type()
    };
}

// 获取CPU信息
function getCPUInfo() {
    const cpus = os.cpus();
    return {
        model: cpus[0]?.model || "Unknown",
        cores: cpus.length,
        speed: cpus[0]?.speed || 0 // MHz
    };
}

program
    .name("myinfo")
    .description("Print current system time, IP address, OS and CPU info")
    .option("--json", "输出 JSON 格式")
    .option("--time-only", "只输出时间")
    .option("--ip-only", "只输出 IP 地址")
    .option("--os", "输出操作系统信息")
    .option("--cpu", "输出CPU信息")
    .parse(process.argv);

const options = program.opts();
const ip = getLocalIP();
const osInfo = getOSInfo();
const cpuInfo = getCPUInfo();

if (options.json) {
    const data = {
        time: now,
        ip: ip || "Not found",
        os: osInfo,
        cpu: cpuInfo
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
        if (options.os || (!options.timeOnly && !options.ipOnly)) {
            console.log(`${chalk.yellow("💻 操作系统：")} ${chalk.white(`${osInfo.type} ${osInfo.platform} ${osInfo.release} ${osInfo.arch}`)}`);
        }
        if (options.cpu || (!options.timeOnly && !options.ipOnly)) {
            console.log(`${chalk.cyan("🧠 CPU：")} ${chalk.white(`${cpuInfo.model} (${cpuInfo.cores} 核心, ${cpuInfo.speed} MHz)`)}`);
        }
    }
}
