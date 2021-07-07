import path from 'path';
import { v4 as uuidV4 } from 'uuid';
import * as io from '@actions/io';
import { existsSync, statSync } from 'fs';

/**
 * Create temporary directory.
 * (borrowed from [here](https://github.com/actions/toolkit/blob/d972090333aaa079cb291d48f8556e8dc051d996/packages/cache/src/internal/cacheUtils.ts#L13-L36))
 * @returns Path to temp directory
 */
export async function createTempDirectory(): Promise<string> {
    const IS_WINDOWS = process.platform === 'win32';

    let tempDirectory: string = process.env.RUNNER_TEMP ?? '';

    if (tempDirectory.length === 0) {
        let baseLocation: string;
        if (IS_WINDOWS) {
            // On Windows use the USERPROFILE env variable
            baseLocation = process.env.USERPROFILE ?? 'C:\\';
        } else {
            if (process.platform === 'darwin') {
                baseLocation = '/Users';
            } else {
                baseLocation = '/home';
            }
        }
        tempDirectory = path.join(baseLocation, 'actions', 'temp');
    }

    const dest = path.join(tempDirectory, uuidV4());
    await io.mkdirP(dest);
    return dest;
}

/**
 * Check if a directory exists.
 * @param path Path to check
 * @returns Is directory?
 */
export function isDirectory(path: string): boolean {
    if (!existsSync(path)) return false;

    const stat = statSync(path);

    return stat.isDirectory();
}
