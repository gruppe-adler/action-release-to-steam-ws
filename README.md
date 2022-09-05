# action-release-to-steam-ws

This action takes your packed Arma 3 mod and releases it to the Steam Workshop. Perfect for automatically pushing GitHub releases to the Steam Workshop.

## Features:
- Convert markdown change notes to steams markup (with some [limitations](#markdown-support))
- Create `meta.cpp` like the Arma 3 Tools' Publisher does (with some [limitations](#metacpp))

## Inputs

### `app_id`
This input is optional (Default: `107410` = Arma 3)  
Workshop app-ID of to publish to

### `file_id`
Workshop file-ID to publish to

### `username`
Steam username

### `password`
Steam password

### `path`
Path to mod folder

### `name`
Name of mod (used in meta.cpp)

### `change_notes_title`
This input is optional (Default: `''`)  
Title of change notes. This will be prepended as a level 1 heading to the changelog.  
Perfect for using with GitHub releases with value `"${{ github.event.release.name }}"`.

### `change_notes`
This input is optional (Default: `*Released with gruppe-adler/release-to-steam-ws*`)  
Body of change notes. If input `change_notes_md` is true this will accept markdown and automatically convert it to steams markup on a best effort basis.
Perfect for using with GitHub releases with value `"${{ github.event.release.body }}"`.

### `change_notes_md`
This input is optional (Default: `true`)
Whether  the change notes are in markdown format.

## Example usage

```yaml
name: 'RELEASE'

on:
  release:
    types: [published]

jobs:
  upload-to-steam:
    name: Upload to Steam Workshop
    if: ${{ !github.event.release.prerelease }} # Do not upload pre releases
    runs-on: windows-latest
    steps:
    - name: Checkout repo
      uses: actions/checkout@v2
    - name: Build with HEMTT
      uses: gruppe-adler/action-release-with-hemtt@2.2.0
      id: build
    - name: Upload mod
      uses: gruppe-adler/action-release-to-steam-ws@v1-beta
      with:
        file_id: <INSERT FILE ID>
        username: "${{ secrets.STEAM_USERNAME }}"
        password: "${{ secrets.STEAM_PASSWORD }}"
        path: "${{ steps.build.outputs.release_path }}/@${{ steps.build.outputs.mod_name }}"
        name: "${{ steps.build.outputs.mod_name }}"
        change_notes_title: "${{ github.event.release.name }}"
        change_notes: "${{ github.event.release.body }}"

```

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)

## Limitations

### `meta.cpp`
We support every fields of Arma 3's `meta.cpp` as described [here](https://community.bistudio.com/wiki/Arma_3:_meta.cpp), except the `hashOverride` field. It is marked as not required, but it is unclear if this causes compatibility issues with the Arma 3 Launcher.

### Markdown support
Converting between markups with diffing feature sets isn't an easy task and can only happen on a best effort basis. It is always recommend to check your Steam WS "Change Notes" for any obvious errors after a new version has been released. Nevertheless it still makes it a lot easier. Fixing a few conversion issues is less work than converting everything from scratch by hand.  

#### Unsupported Markdown Features
- Code syntax highlighting
- Converting HTML is not supported at all
- Starting ordered lists with something else than 1
- Table cell alignment
- Inline code (will just be normal text)
- Link titles
- Alternative text of images
- Headings level 4 (will be bold text with an EOL at the end)
- Headings levels 5 and 6 (will just be displayed as normal text with an EOL at the end)

## Contributing
You can run everything (`test`, `lint`, `build` & `package`) with `npm run all`.  
Make sure commit the `./dist` directory!!
