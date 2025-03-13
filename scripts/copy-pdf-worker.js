const fs = require("fs");
const path = require("path");

// Create the pdf-worker directory in public if it doesn't exist
const publicDir = path.join(process.cwd(), "public");
const pdfWorkerDir = path.join(publicDir, "pdf-worker");

if (!fs.existsSync(pdfWorkerDir)) {
	fs.mkdirSync(pdfWorkerDir, { recursive: true });
}

// Copy the worker file from node_modules to public
const workerFile = path.join(
	process.cwd(),
	"node_modules",
	"pdfjs-dist",
	"build",
	"pdf.worker.mjs",
);
const destFile = path.join(pdfWorkerDir, "pdf.worker.min.js");

try {
	fs.copyFileSync(workerFile, destFile);
	console.log("PDF worker file copied successfully!");
} catch (error) {
	console.error("Error copying PDF worker file:", error);
	process.exit(1);
}
