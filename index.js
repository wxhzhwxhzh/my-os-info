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

// 获取系统信息，增加内存、主机名、uptime、用户信息
function getOSInfo() {
    return {
        platform: os.platform(),
        release: os.release(),
        arch: os.arch(),
        type: os.type(),
        hostname: os.hostname(),
        uptime: os.uptime(), // 秒
        totalmem: os.totalmem(), // 字节
        freemem: os.freemem(), // 字节
        userInfo: os.userInfo()
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

// 内存格式化
function formatMem(bytes) {
    return (bytes / 1024 / 1024 / 1024).toFixed(2) + " GB";
}

// uptime 格式化
function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}h ${m}m ${s}s`;
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
            console.log(`${chalk.magenta("🖥️ 主机名：")} ${chalk.white(osInfo.hostname)}`);
            console.log(`${chalk.magenta("⏳ 运行时长：")} ${chalk.white(formatUptime(osInfo.uptime))}`);
            console.log(`${chalk.magenta("💾 总内存：")} ${chalk.white(formatMem(osInfo.totalmem))}`);
            console.log(`${chalk.magenta("💾 可用内存：")} ${chalk.white(formatMem(osInfo.freemem))}`);
            console.log(`${chalk.magenta("👤 当前用户：")} ${chalk.white(osInfo.userInfo.username)}`);
        }
        if (options.cpu || (!options.timeOnly && !options.ipOnly)) {
            console.log(`${chalk.cyan("🧠 CPU：")} ${chalk.white(`${cpuInfo.model} (${cpuInfo.cores} 核心, ${cpuInfo.speed} MHz)`)}`);
        }
    }
}
