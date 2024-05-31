# EZ-Server (Work in Progress)

### Concept

EZ-Server is a user-friendly application with a graphical user interface (GUI)  designed to simplify local development server management for front-end developers. It aims to eliminate the need for complex command-line configurations, especially for those new to the development process.

### Features (Planned)

**Effortless Server Management:** Start, configure, and manage local development servers through an intuitive and easy-to-use interface.
**Multiple Server Instances:** Run and manage multiple server instances simultaneously for efficient development workflows.
**Presets (Future):** Offer pre-configured server setups for popular frameworks, streamlining the setup process (to be implemented).
**Hot Reloading (Future):** Automatically refresh the browser whenever changes are detected in your project files (to be implemented).
**Customizable Options (Future Consideration):** Allow users to configure server settings like ports and environment variables for advanced use cases (future consideration).
**Detailed Logging:** Track server activity and errors with comprehensive logs. Daily log rotation with compression and upload to a designated service is planned (implementation details to be determined).
**Automatic Updates:** Receive automatic updates for bug fixes and new features to keep your development environment up-to-date (planned).

### Current Stage

EZ-Server is under active development. The core functionalities are being built, and new features are planned based on user feedback and future needs.

### Contribution

This project welcomes contributions! If you're interested in helping shape this application, feel free to follow the development process and provide feedback.

---
<br><br><br>






# AI Context

Context for AI Assistant on EZ-Server Development

### Project Name:
EZ-Server (Work in Progress)

### Project Goal: 
Develop a user-friendly Electron application with a GUI to simplify local development server management for front-end developers.

### Target Users: 
Front-end developers, especially those new to the development process who want to avoid complex command-line configurations.

### Current Features:

Core functionalities under development.

### Planned Features:

- Effortless Server Management: Mo configuration file, no command line. Most simple projects can be started in just a couple of clicks. Intuitive interface for starting, configuring, and managing local development servers.
- File and rquest handling that is unopinionated about source code file structure, duplicated file names, etc with the implementation of user source code parsing and custom cachee building. 
- Persistance of server/prject configurations and app confogurations (as well as chaches, etc) using something like Electron Store.
- Multiple Server Instances: Ability to run and manage multiple servers simultaneously.
- Presets (Future): Pre-configured server setups for popular frameworks to streamline setup.
- Frameowrk/ library/ precompiler detection through user source code parsing and custom cache completion.
- Hot Reloading (Future): Automatic browser refresh on file changes.
- Customizable Options (Future Consideration): Configuration options for server ports and environment variables.
- Detailed Logging: Comprehensive logs for tracking server activity and errors. Daily log rotation with compression and upload (implementation details to be determined).
- Automatic Updates: Updates for bug fixes and new features.
- HTTPS, IPV6 compatibility. HTTPS automatic an manual secret key and cert generation (possibly with a service integration for non-self-signed cert capability)

### Technical Stack:

Electron
Express for server management
Node.js
Winston (for logging)
Helmet for CSP
Chokidar for file watching hto reload triggering
Additional libraries might be considered 

### Current Stage:

Actively developing core functionalities. Tying everything together and implementing file watchign and hot reloading. 