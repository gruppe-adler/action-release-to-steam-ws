import * as core from '@actions/core';
import { writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { mdToSteam } from './mdToSteam';
import { generateMetaCPP } from './metaCPP';
import { publishWorkshopItem, setupSteamCMD } from './steamcmd';
import { isDirectory } from './utils';

async function run(): Promise<void> {
    try {
        const fileId = Number.parseInt(core.getInput('file_id', { required: true }), 10);
        if (Number.isNaN(fileId)) throw new Error('Input must be a valid number: file_id');

        const appId = Number.parseInt(core.getInput('app_id'), 10);
        if (Number.isNaN(appId)) throw new Error('Input must be a valid number: app_id');

        const username = core.getInput('username', { required: true });
        const password = core.getInput('password', { required: true });

        const modPath = resolve(core.getInput('path', { required: true }));
        if (!isDirectory(modPath)) throw new Error(`Input path must be an existing directory: path (${modPath})`);
        core.debug(`Absolute mod path: ${modPath}`);

        // meta.cpp
        {
            const name = core.getInput('name', { required: true });

            const metaPath = join(modPath, 'meta.cpp');
            // TODO: generate hashOverride
            const metaCPP = generateMetaCPP(fileId, name);
            await core.group('meta.cpp', async() => {
                core.info(metaCPP);
            });
            writeFileSync(metaPath, metaCPP);
            core.debug(`meta.cpp written to ${metaPath}`);
        }

        const changeNotes = generateChangeNotes();
        await core.group('Change Notes (Steam Markup)', async() => {
            core.info(changeNotes);
        });

        await core.group('Setting up SteamCMD', () => setupSteamCMD());
        await core.group('Publishing Mod', () => publishWorkshopItem(username, password, modPath, appId, fileId, changeNotes));
    } catch (err) {
        core.setFailed(err.message);
    }
}

function generateChangeNotes(): string {
    const isMarkdown = core.getBooleanInput('change_notes_md');

    const changeNotesTitle = core.getInput('change_notes_title');
    const changeNotesBody = core.getMultilineInput('change_notes').join('\n');

    if (isMarkdown) {
        const mdChangeNotes = changeNotesTitle === '' ? changeNotesBody : `# ${changeNotesTitle}\n${changeNotesBody}`;
        core.debug('Change Notes (Markdown):');
        core.debug(mdChangeNotes);

        return mdToSteam(mdChangeNotes);
    } else {
        return changeNotesTitle === '' ? changeNotesBody : `[h1]${changeNotesTitle}[/h1]\n${changeNotesBody}`;
    }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
