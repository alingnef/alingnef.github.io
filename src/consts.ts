export const SITE_TITLE = "Crypto CTF Notes";
export const SITE_DESCRIPTION =
  "Ghi chép tiếng Việt về cryptography trong CTF: RSA, ECC, lattice, số học và cách viết write-up có thể tái lập.";

export const AUTHOR_NAME = "aling";
export const GITHUB_USERNAME = "alingnef";
export const QUOTE =
  "Ghi chép cách đọc đề, dựng giả thuyết và giải những bài crypto CTF thú vị.";

export const TOPICS = [
  "RSA",
  "ECC",
  "Lattice",
  "Số học",
  "PRNG",
  "Crypto protocol",
  "SageMath",
  "Write-up",
];

export const ABOUT_ME =
  "Đây là cuốn sổ tay cá nhân về cryptography trong CTF. Mỗi bài cố gắng ghi lại giả thuyết ban đầu, cách kiểm chứng, đoạn mã giải và những ngõ cụt đáng nhớ để người đọc có thể tự tái lập lời giải.";

export const NAV_LINKS: Array<{
  title: string;
  href: string;
  external?: boolean;
}> = [
  { title: "Bài viết", href: "blog/" },
  { title: "Giới thiệu", href: "#gioi-thieu" },
  {
    title: "GitHub",
    href: `https://github.com/${GITHUB_USERNAME}`,
    external: true,
  },
];
