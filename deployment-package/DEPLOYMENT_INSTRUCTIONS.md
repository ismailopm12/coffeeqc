# Coffee Quality Control App - Deployment Instructions

## Build Information
- Build Date: September 29, 2025
- Build Size: ~226 KB (compressed)
- Framework: React + Vite + TypeScript
- Backend: Supabase

## Deployment to cPanel

### Prerequisites
1. cPanel account with file manager access
2. Domain or subdomain configured in cPanel
3. Basic understanding of cPanel file management

### Deployment Steps

1. **Upload Files**
   - Extract the `coffee-quality-app.zip` file
   - Upload all contents of the `dist` folder to your cPanel file manager
   - Place files in the appropriate directory for your domain (usually `public_html` or a subdirectory)

2. **File Structure**
   After uploading, your directory should contain:
   ```
   assets/
     ├── index-C1np2THt.js
     └── index-DgPo9oWB.css
   favicon.ico
   index.html
   placeholder.svg
   robots.txt
   ```

3. **Configure Domain**
   - If using a subdomain, ensure it points to the correct directory
   - If using the main domain, files should be in `public_html`

4. **Verify Deployment**
   - Visit your domain/subdomain in a web browser
   - The Coffee Quality Control application should load
   - Test all functionality including:
     - User authentication
     - Data submission
     - Admin panel access (if you're an admin user)

### Environment Configuration

The application uses the following environment variables which are already embedded in the build:
- `VITE_SUPABASE_URL`: https://ofvwripyhjnslvfvvmnl.supabase.co
- `VITE_SUPABASE_PUBLISHABLE_KEY`: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdndyaXB5aGpuc2x2ZnZ2bW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMjE0MjcsImV4cCI6MjA3NDY5NzQyN30.82yWKRq-aJ1jlLpE6frPa9OTb7U4MXM0jDKz-eVxIFE

### Admin Access

To access admin features:
1. Ensure your email is added to the admin list in the Supabase database
2. Login with an admin account
3. Navigate to the Admin Panel through the menu

### Troubleshooting

1. **Blank Page**: 
   - Ensure all files were uploaded correctly
   - Check browser console for errors
   - Verify `index.html` is in the root directory

2. **Application Not Loading**:
   - Check that all assets in the `assets` folder were uploaded
   - Verify file permissions (should be 644 for files, 755 for directories)

3. **Supabase Connection Issues**:
   - Ensure your domain is whitelisted in Supabase dashboard
   - Check network connectivity

### Support

For additional support, contact the development team or use the WhatsApp support button in the application.