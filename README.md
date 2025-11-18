# Next.js & HeroUI Template

This is a template for creating applications using Next.js 14 (app directory) and HeroUI (v2).

[Try it on CodeSandbox](https://githubbox.com/heroui-inc/heroui/next-app-template)

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/heroui-inc/next-app-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/heroui-inc/next-app-template/blob/main/LICENSE).

## Persistence on Railway (Volume)

This project persists dynamic content (JSON configs and admin-uploaded images) in a mounted volume. By default we use `/data` (Railway mount path). You can override with `DATA_DIR`.

Persisted paths under the volume:

- `config/heroes.json`
- `config/partners.json`
- `config/srcMap.json`
- `uploads/` (images)

Behavior:

- Read: APIs first read from `/data`, then fall back to repository defaults.
- Write: Admin dashboard writes only to `/data`.
- Serve: Images uploaded through the PHP service are available at `${UPLOADER_URL}/files/<path>`; legacy `/uploads/<filename>` URLs remain for older base64 entries.

Railway setup steps:

1. Create a Volume and mount it to `/data` for the service.
2. Optionally set env var `DATA_DIR=/data` (default is already `/data`).
3. Manage files via Railway's volume UI under the paths listed above.

## PHP Uploader Integration

This project uses a separate PHP microservice for image uploads. The PHP uploader is deployed as a separate Railway service with its own volume.

### Setup Instructions

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed configuration instructions.

**Quick Setup:**
1. Deploy the `php-uploader/` folder as a separate Railway service
2. Add a Volume mounted at `/data` on the PHP service
3. Set environment variables on PHP service:
   - `STORAGE_DIR=/data`
   - `CORS_ALLOW_ORIGIN=https://your-nextjs-app.railway.app`
4. Set environment variables on this Next.js service:
   - `UPLOADER_URL=https://your-php-uploader.railway.app`
   - `UPLOADER_DIR=heroes` (optional, default: "images")

### Testing

Use the Dashboard's "PHP Uploader Diagnostics" section to test connectivity:
1. Go to `/dashboard` and login
2. Scroll to "PHP Uploader Diagnostics"
3. Click "Run Tests" to verify configuration

### Troubleshooting

If images upload but don't display:
- Check that the PHP service has a volume mounted at `/data`
- Verify `STORAGE_DIR=/data` is set on the PHP service
- Restart the PHP service after adding the volume
- Test file access directly: `https://your-php-uploader.railway.app/files/path/to/file.jpg`

See [ENV_SETUP.md](./ENV_SETUP.md) for detailed troubleshooting steps.
