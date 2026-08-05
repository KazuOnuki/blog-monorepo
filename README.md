# Japan Support Blogs monorepo

This repository is the unified source for four existing GitHub Pages sites. Public URLs and deployment repositories remain unchanged.

Central repository: `https://github.com/japan-support-blogs/blog-monorepo`

The `japan-support-blogs` organization uses existing GitHub accounts as owners; it does not require a separate login or email address.

| Site key | Content | Public site | Deployment repository |
|---|---|---|---|
| `jpaiblog` | `content/jpaiblog.github.io/` | `https://jpaiblog.github.io/blog/` | `jpaiblog/blog` |
| `jpiotblog` | `content/jpiotblog.github.io/` | `https://jpiotblog.github.io/blog/` | `jpiotblog/blog` |
| `jpmlblog` | `content/jpmlblog.github.io/` | `https://jpmlblog.github.io/blog/` | `jpmlblog/blog` |
| `jpwdkblog` | `content/jpwdkblog.github.io/` | `https://jpwdkblog.github.io/blog/` | `jpwdkblog/blog` |

## Structure

- `content/`: Markdown and image sources imported with complete history from the four original repositories.
- `sites/`: Site-specific Hexo configuration and favicon assets.
- `themes/material-flow/`: One shared theme for all sites.
- `tools/`: Build, validation, deployment, and mirror synchronization commands.
- `scripts/`: Hexo runtime compatibility filters.
- `dist/`: Generated sites (ignored by Git).

## Setup

```powershell
npm ci
npm run build
npm run verify:urls
```

The URL verification compares every generated public path with tracked manifests under `baselines/`. Deployment is blocked automatically if any path changes. During migration, `npm run verify:urls -- --against ../hexo` can compare directly with the current local production clones.

## Common commands

```powershell
npm run build                         # Build all sites
npm run build:ai                      # Build one site
npm run serve -- jpmlblog             # Preview one site
npm run verify:urls                   # Verify all public paths
npm run sync:mirrors                  # Update the four legacy source clones
npm run deploy -- jpaiblog            # Deploy one existing site
npm run deploy                        # Deploy all four existing sites
```

`blogmanagement.bat` provides the same workflow as a menu.

## Editing workflow

1. Edit content under `content/<repository>/`.
2. Run `npm run build` and `npm run verify:urls`.
3. Commit the changes to this monorepo.
4. Run `npm run sync:mirrors` to update the legacy content clones.
5. Review, commit, and push those mirrors with the existing workflow when compatibility repositories must be updated.
6. Deploy from the monorepo.

The legacy repositories are mirrors after migration. Do not edit them directly once a central remote for this monorepo has been established.

## Compatibility repairs

The migration keeps every existing public path. Three legacy rendering accidents are intentionally corrected without changing URLs:

- The two ML posts dated 2025-04-10 now get deterministic previous/next navigation.
- `Azure Machine Learning Studio (Classic)` and `(classic)` share the existing uppercase category URL.
- WDK `Printer` and `printer` tags share the existing lowercase tag URL, so the tag page contains all matching posts.

Legacy heading anchors are reproduced per site where earlier Markdown renderer versions encoded `/` differently.

## History

The four original `master` histories were imported without squashing using `git subtree add`. Their original HEAD commits are ancestors of this repository's `main` branch.
