# Random Chat App (Node + Express + Socket.IO + React Native)

A random chat app with queue-based pairing, dark theme UI, and on-device message storage using SQLite.

## Features
- Queue-based pairing with timeouts and partner disconnect notifications
- Node.js server using Express + Socket.IO
- React Native (Expo) client with dark palette
- Onboarding (first run only): set name and photo; editable later
- Past chats list with peer name/photo, last message, and timestamp
- On-device message persistence via Expo SQLite

## Project Structure
- `client/` – Expo app (React Native)
- `server/` – Node/Express/Socket.IO server

## Server Setup
```bash
cd server
npm install
npm run dev
```
- Default port: 4000
- Key events: `paired`, `name`, `message`, `image`, `partner_disconnected`
- Pairing: FIFO queue; entries expire after 60s of inactivity; disconnects clean up queue and notify partners

## Client Setup
```bash
cd client
npm install
npm start
```
- Use Expo Go to scan the QR code.
- First launch shows onboarding to set name/photo (stored in AsyncStorage).
- Messages are stored in SQLite on device.

## Connect Your Phone
1. Ensure phone and computer are on the same Wi‑Fi (or choose Expo “tunnel”).
2. Find LAN IP (Windows PowerShell):
```powershell
ipconfig | findstr /i "IPv4"
```
3. Configure the client to connect to `http://YOUR_LAN_IP:4000` if using Socket.IO.

## Client Local DB
- `messages(id, room, sender, content, isImage, createdAt)`
- `rooms(room PRIMARY KEY, peerName, peerImage, updatedAt)`

## Theming
- Dark colors in `client/theme.js`
  - Backgrounds: `#121212`, `#1E1E1E`, `#242424`, `#2C2C2C`
  - Your bubbles: blue accents (e.g., `#3B82F6`)
  - Other bubbles: neutral grays (e.g., `#2C2C2E`)
  - Text: primary `#EDEDED`, secondary `#A1A1AA`

## Git Tips
- `.gitignore` in both `client/` and `server/` excludes `node_modules/` and build artifacts.

## License
MIT
