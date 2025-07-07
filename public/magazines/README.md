# Dynamic Magazine System

This system automatically creates magazines from images in folders. Here's how to use it:

## 📁 Folder Structure

```
public/
└── magazines/
    ├── janki/          ← Magazine ID
    │   ├── 1.jpg       ← Page 1
    │   ├── 2.png       ← Page 2
    │   ├── 3.jpg       ← Page 3
    │   └── ...
    ├── birthday/       ← Another magazine
    │   ├── 1.jpg
    │   ├── 2.jpg
    │   └── ...
    └── memories/       ← Yet another magazine
        ├── 1.png
        ├── 2.jpg
        └── ...
```

## 🚀 How to Use

1. **Create a Magazine Folder**: Create a folder in `public/magazines/` with your desired magazine ID
2. **Add Images**: Add images named `1.jpg`, `2.jpg`, `3.png`, etc. in the order you want them to appear
3. **Access the Magazine**: Visit `/magazine/[folder-name]` in your browser

## 📝 Examples

- `/magazine/janki` - Creates a magazine from images in `public/magazines/janki/`
- `/magazine/birthday` - Creates a magazine from images in `public/magazines/birthday/`
- `/magazine/memories` - Creates a magazine from images in `public/magazines/memories/`

## ✨ Features

- **Automatic Detection**: The system automatically detects how many images are in the folder
- **Dynamic Sizing**: Magazine automatically adjusts to the number of images
- **Sorted Pages**: Images are sorted by their numeric filename (1.jpg, 2.jpg, etc.)
- **Supported Formats**: .jpg, .jpeg, .png, .gif, .webp, .bmp
- **Real-time Updates**: Add or remove images and refresh to see changes

## 📋 Image Naming Rules

- Use numbers for ordering: `1.jpg`, `2.png`, `3.jpeg`
- Start from 1 and increment: `1.jpg`, `2.jpg`, `3.jpg`
- Any supported image format works
- Non-numeric files are ignored

## 🎨 Automatic Features

- **Cover Page**: Automatically generated with the magazine ID as title
- **Page Numbering**: Automatic page numbers
- **Image Optimization**: Next.js optimizes images automatically
- **Responsive Design**: Works on all screen sizes
- **Keyboard Navigation**: Arrow keys, spacebar, home/end keys
- **Loading States**: Shows loading while images are being processed
- **Error Handling**: Clear error messages if folder doesn't exist

Just drop your images in a folder and you're ready to go! 🎉
