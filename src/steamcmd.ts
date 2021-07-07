import * as exec from '@actions/exec';
import * as core from '@actions/core';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { createTempDirectory } from './utils';

const STEAM_CMD_PATH = join(__dirname, 'steamcmd.exe');
const STEAM_STD_ERR_PATH = join(__dirname, 'logs', 'stderr.txt');

/**
 * Generate VDF file, which is used with SteamCMD to upload a mod.
 * @param absPath Absolute path to mod
 * @param appId AppID
 * @param fileId Steam Workshop Item ID
 * @param changeNotes Change notes to describe new version
 * @returns VDF
 */
function generateVDF(absPath: string, appId: number, fileId: number, changeNotes: string): string {
    return `
"workshopitem"
    {
        "appid"            "${appId}"
        "publishedfileid"  "${fileId}"
        "contentfolder"    "${absPath}"
        "changenote"       "${changeNotes.replace(/"/g, '') /* We do not like quotes */}"
    }
`;
}

/**
 * Utility function to run SteamCMD. Will automatically log standard error, if any errors occur.
 * @param args Arguments (see exec.exec())
 */
async function execSteamCMD(args: string[]): Promise<void> {
    try {
        await exec.exec(STEAM_CMD_PATH, args);
    } catch (err) {
        const stdErr = readFileSync(STEAM_STD_ERR_PATH, 'utf8');
        core.error(`The following is SteamCMD's standard error output:\n--- ${STEAM_STD_ERR_PATH} START ---\n${stdErr}\n--- ${STEAM_STD_ERR_PATH} START ---`);
        throw err;
    }
}

/**
 * Setup SteamCMD. SteamCMD will check for updates and install some stuff when running fot the
 * first time. We want to make sure this is an extra step to make it easier to understand
 * on which step any errors occur.
 */
export async function setupSteamCMD(): Promise<void> {
    try {
        await execSteamCMD(['+quit']);
    } catch (err) {
        // we ignore any errors on purpose, because some shitty SteamCMD version always
        // exits with code 7 and I can't figure out why... everything seems to work tho :D
        core.error(err);
    }
}

/**
 * Publish a workshop item.
 * @param username Username
 * @param password Password
 * @param modPath Absolute path to mod
 * @param appId AppID
 * @param fileId Steam WS Item ID
 * @param changeNotes Change notes to describe new version
 */
export async function publishWorkshopItem(username: string, password: string, modPath: string, appId: number, fileId: number, changeNotes: string): Promise<void> {
    const tmpPath = await createTempDirectory();
    const vdfPath = join(tmpPath, 'workshop.vdf');

    const vdf = generateVDF(modPath, appId, fileId, changeNotes);
    writeFileSync(vdfPath, vdf);
    core.debug('workshop.vdf');
    core.debug(vdf);

    const args = [
        '+login', username, password,
        '+workshop_build_item', vdfPath,
        '+quit'
    ];

    await execSteamCMD(args);
}
