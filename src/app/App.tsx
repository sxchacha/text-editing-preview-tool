import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import lottie from "lottie-web";
import type { AnimationItem } from "lottie-web";
import "pretty-color-picker";
// @ts-ignore
import domtoimage from "dom-to-image-more";
import { FLUENT_EMOJI_CATS, fluentUrl } from "./data/fluentEmoji";
import {
  Heart, Star, Flame, Zap, Crown, Gift, Trophy, Bell, Bookmark, Coffee,
  Rocket, Globe, Home, Music, Camera, Diamond, Cloud, Sun, Moon, Leaf,
  Mountain, Fish, Bird, Car, Plane, Anchor, Shield, Key, Compass,
  Phone, Mail, Clock, Headphones, Mic, Video, Book, Pencil, Scissors,
  Wrench, Lock, Smile, Frown, Meh, Gamepad2, Palette, Sparkles, Gem,
  Bold, Italic, ImagePlus, Search, ChevronDown, Check, RotateCcw,
  AlignLeft, AlignCenter, AlignRight, Type, X, Monitor, RefreshCw,
} from "lucide-react";
import {
  RiHeartLine, RiHeartFill, RiStarLine, RiStarFill, RiFireLine, RiFireFill,
  RiFlashlightLine, RiCompassLine, RiTrophyLine, RiTrophyFill, RiVipCrownLine,
  RiVipCrownFill, RiGiftLine, RiGiftFill, RiBellLine, RiBellFill, RiBookmarkLine,
  RiBookmarkFill, RiCupLine, RiRocketLine, RiRocketFill, RiGlobalLine,
  RiHome2Line, RiHome2Fill, RiMusic2Line, RiMusic2Fill, RiCameraLine,
  RiCameraFill, RiGamepadLine, RiGamepadFill, RiPaletteLine, RiPaletteFill,
  RiSparkling2Line, RiSparkling2Fill, RiLightbulbLine, RiLightbulbFill, RiToolsLine,
  RiPaintBrushLine, RiPaintBrushFill, RiSearchLine, RiSettings3Line,
  RiUser3Line, RiUser3Fill, RiTeamLine, RiMailLine, RiMailSendLine,
  RiChat3Line, RiDiscussLine, RiFileTextLine, RiFolderOpenLine,
  RiPencilLine, RiScissorsLine, RiShieldLine, RiShieldFill, RiKeyLine,
  RiLockLine, RiLockUnlockLine, RiPlayLine, RiPauseLine, RiVolumeUpLine,
  RiMicLine, RiHeadphoneLine, RiSunLine, RiMoonLine, RiCloudLine,
  RiCarLine, RiPlaneLine, RiShipLine, RiAnchorLine, RiTimeLine,
  RiSmartphoneLine, RiComputerLine
} from "react-icons/ri";

// ── Types ─────────────────────────────────────────────────────────────────────
type IconComp = React.FC<{ size?: number; color?: string; strokeWidth?: number; className?: string }>;

// Local Font Access API types
interface FontData { family: string; fullName: string; postscriptName: string; style: string; }
type LocalFontsStatus = "idle" | "loading" | "success" | "denied" | "blocked" | "error" | "unsupported";
declare global {
  interface Window { queryLocalFonts(opts?: { postscriptNames?: string[] }): Promise<FontData[]>; }
  // pretty-color-picker web component
  namespace JSX {
    interface IntrinsicElements {
      "pretty-color-picker": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string; label?: string; theme?: string; mode?: string;
        anchor?: string; movable?: string; history?: string; "header-action"?: string;
      };
    }
  }
}

// ── Google Fonts ──────────────────────────────────────────────────────────────
const GOOGLE_FONTS = [
  { name: "Anton", category: "Display" },
  { name: "Bebas Neue", category: "Display" },
  { name: "Abril Fatface", category: "Display" },
  { name: "Bangers", category: "Display" },
  { name: "Righteous", category: "Display" },
  { name: "Fredoka One", category: "Display" },
  { name: "Boogaloo", category: "Display" },
  { name: "Permanent Marker", category: "Handwriting" },
  { name: "Indie Flower", category: "Handwriting" },
  { name: "Caveat", category: "Handwriting" },
  { name: "Kalam", category: "Handwriting" },
  { name: "Dancing Script", category: "Script" },
  { name: "Pacifico", category: "Script" },
  { name: "Sacramento", category: "Script" },
  { name: "Great Vibes", category: "Script" },
  { name: "Satisfy", category: "Script" },
  { name: "Lobster", category: "Script" },
  { name: "Montserrat", category: "Sans" },
  { name: "Poppins", category: "Sans" },
  { name: "Raleway", category: "Sans" },
  { name: "Inter", category: "Sans" },
  { name: "Roboto", category: "Sans" },
  { name: "Open Sans", category: "Sans" },
  { name: "Oswald", category: "Sans" },
  { name: "Space Grotesk", category: "Sans" },
  { name: "Archivo Black", category: "Sans" },
  { name: "Playfair Display", category: "Serif" },
  { name: "Lora", category: "Serif" },
  { name: "Merriweather", category: "Serif" },
  { name: "Libre Baskerville", category: "Serif" },
  { name: "EB Garamond", category: "Serif" },
  { name: "DM Serif Display", category: "Serif" },
  { name: "Cinzel", category: "Serif" },
  { name: "Press Start 2P", category: "Pixel" },
];

// ── Emoji categories ──────────────────────────────────────────────────────────
const EMOJI_CATS: Record<string, string[]> = {
  "😀 Smiles": ["😀","😂","😍","🥰","😊","😎","🤩","😜","🤔","😴","😭","🥺","😤","🤯","🥳","😏","🙃","🤗","😇","😈","🥸","🤓","😬","🤪","😌","😋","🤤","😑","😶","🫠"],
  "❤️ Hearts": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","💕","💖","💗","💓","💘","💝","💞","💟","❣️","💔","🫶","♥️"],
  "✨ Magic": ["✨","🌟","⭐","💫","🔥","💥","⚡","🌈","❄️","☀️","🌙","🌊","🍀","💎","🪄","🎆","🌌","☁️","🌸","🌺","🌻","🌍","🦋","🍃"],
  "🐾 Animals": ["🐶","🐱","🐻","🦊","🐼","🐨","🐯","🦁","🐸","🐙","🦋","🐝","🦄","🐉","🦅","🐺","🦌","🦩","🐬","🦈","🦒","🦓","🐘","🦏","🦛"],
  "🍕 Food": ["🍕","🍔","🍣","🍜","🍦","🎂","🍿","🥐","🍫","🧋","☕","🍺","🍷","🥑","🍓","🍎","🍋","🌮","🍩","🥞","🍱","🥟","🍰","🧇","🥓"],
  "🎉 Fun": ["🎉","🎊","🎸","🎹","🚀","💻","📱","🎨","📸","🔮","🎭","🏆","🎯","🎪","🎲","🃏","🧩","🎮","🎬","🎤","🎠","🎡","🛸","🎰","🧸"],
};

// ── Icon map (Remix Icons) ───────────────────────────────────────────────────
const ICON_MAP: Record<string, IconComp> = {
  // Favorites
  "Heart Line": RiHeartLine, "Heart Fill": RiHeartFill,
  "Star Line": RiStarLine, "Star Fill": RiStarFill,
  "Flame Line": RiFireLine, "Flame Fill": RiFireFill,
  "Crown Line": RiVipCrownLine, "Crown Fill": RiVipCrownFill,
  "Trophy Line": RiTrophyLine, "Trophy Fill": RiTrophyFill,
  "Gift Line": RiGiftLine, "Gift Fill": RiGiftFill,
  "Sparkles Line": RiSparkling2Line, "Sparkles Fill": RiSparkling2Fill,
  
  // Media / Tech
  "Music": RiMusic2Line, "Music Fill": RiMusic2Fill,
  "Camera": RiCameraLine, "Camera Fill": RiCameraFill,
  "Gamepad": RiGamepadLine, "Gamepad Fill": RiGamepadFill,
  "Headphones": RiHeadphoneLine, "Microphone": RiMicLine,
  "Volume Up": RiVolumeUpLine, "Play": RiPlayLine, "Pause": RiPauseLine,
  "Computer": RiComputerLine, "Phone": RiSmartphoneLine,
  
  // Design / Tools
  "Palette Line": RiPaletteLine, "Palette Fill": RiPaletteFill,
  "Brush Line": RiPaintBrushLine, "Brush Fill": RiPaintBrushFill,
  "Lightbulb Line": RiLightbulbLine, "Lightbulb Fill": RiLightbulbFill,
  "Tools": RiToolsLine, "Pencil": RiPencilLine, "Scissors": RiScissorsLine,
  
  // System / Business
  "Home Line": RiHome2Line, "Home Fill": RiHome2Fill,
  "Search": RiSearchLine, "Settings": RiSettings3Line,
  "User Line": RiUser3Line, "User Fill": RiUser3Fill,
  "Team": RiTeamLine, "Mail": RiMailLine, "Send": RiMailSendLine,
  "Chat": RiChat3Line, "Discuss": RiDiscussLine,
  
  // Objects / Places
  "Cup": RiCupLine, "Rocket Line": RiRocketLine, "Rocket Fill": RiRocketFill,
  "Globe": RiGlobalLine, "Compass": RiCompassLine, "Key": RiKeyLine,
  "Lock": RiLockLine, "Unlock": RiLockUnlockLine, "Shield Line": RiShieldLine, "Shield Fill": RiShieldFill,
  "Clock": RiTimeLine, "Folder Open": RiFolderOpenLine, "File Text": RiFileTextLine,
  "Book Mark Line": RiBookmarkLine, "Book Mark Fill": RiBookmarkFill,
  
  // Travel / Weather
  "Car": RiCarLine, "Plane": RiPlaneLine, "Ship": RiShipLine, "Anchor": RiAnchorLine,
  "Sun": RiSunLine, "Moon": RiMoonLine, "Cloud": RiCloudLine, "Flashlight": RiFlashlightLine
};

// ── Helper: load Google Font ──────────────────────────────────────────────────
function loadGoogleFont(name: string) {
  const id = `gf-${name.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.crossOrigin = "anonymous";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:ital,wght@0,400;0,700;0,900;1,400&display=swap`;
  document.head.appendChild(link);
}

// ── Helper: restore saved range ───────────────────────────────────────────────
function restoreSavedRange(savedRange: Range | null): boolean {
  if (!savedRange) return false;
  const sel = window.getSelection();
  if (!sel) return false;
  sel.removeAllRanges();
  sel.addRange(savedRange.cloneRange());
  return true;
}

// ── Helper: find preceding element in text flow ──────────────────────────────
function getPrecedingElement(container: Node, offset: number, editor: HTMLElement | null): Element | null {
  if (container.nodeType === Node.ELEMENT_NODE) {
    if (offset > 0 && offset <= container.childNodes.length) {
      const node = container.childNodes[offset - 1];
      if (node instanceof Element) return node;
    }
  } else if (container.nodeType === Node.TEXT_NODE) {
    const text = container.textContent || "";
    if (offset === 0 || (offset === 1 && text.startsWith("\u200B"))) {
      let curr: Node | null = container;
      while (curr && curr !== editor) {
        if (curr.previousSibling) {
          const prev = curr.previousSibling;
          if (prev instanceof Element) return prev;
          if (prev.nodeType === Node.TEXT_NODE) {
            if ((prev.textContent || "").length > 0) return null;
          }
        }
        curr = curr.parentNode;
      }
    }
  }
  return null;
}

// ── Helper: find succeeding element in text flow ─────────────────────────────
function getSucceedingElement(container: Node, offset: number, editor: HTMLElement | null): Element | null {
  if (container.nodeType === Node.ELEMENT_NODE) {
    if (offset >= 0 && offset < container.childNodes.length) {
      const node = container.childNodes[offset];
      if (node instanceof Element) return node;
    }
  } else if (container.nodeType === Node.TEXT_NODE) {
    const text = container.textContent || "";
    if (offset === text.length || (offset === text.length - 1 && text.endsWith("\u200B"))) {
      let curr: Node | null = container;
      while (curr && curr !== editor) {
        if (curr.nextSibling) {
          const next = curr.nextSibling;
          if (next instanceof Element) return next;
          if (next.nodeType === Node.TEXT_NODE) {
            if ((next.textContent || "").length > 0) return null;
          }
        }
        curr = curr.parentNode;
      }
    }
  }
  return null;
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem("moonvy_font_family") || "Anton");
  const [fontSize, setFontSize] = useState(() => Number(localStorage.getItem("moonvy_font_size")) || 80);
  const [textColor, setTextColor] = useState(() => localStorage.getItem("moonvy_text_color") || "#111111");
  const [bgColor, setBgColor] = useState(() => localStorage.getItem("moonvy_bg_color") || "#fafaf8");
  const [lineHeight, setLineHeight] = useState(() => Number(localStorage.getItem("moonvy_line_height")) || 1.25);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(() => (localStorage.getItem("moonvy_text_align") as any) || "left");

  const [showFontMenu, setShowFontMenu] = useState(false);
  const [fontSource, setFontSource] = useState<"google" | "local">("google");
  const [fontSearch, setFontSearch] = useState("");
  const [fontCat, setFontCat] = useState("All");
  const [localFonts, setLocalFonts] = useState<string[]>([]);
  const [localFontsStatus, setLocalFontsStatus] = useState<LocalFontsStatus>("idle");
  const [localFontSearch, setLocalFontSearch] = useState("");
  const [manualFontInput, setManualFontInput] = useState("");

  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [emojiSource, setEmojiSource] = useState<"system" | "fluent">("fluent");
  const [emojiCat, setEmojiCat] = useState("😀 Smiles");
  const [fluentCat, setFluentCat] = useState("😀 笑脸");

  const [showIconPanel, setShowIconPanel] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  const [pendingIcon, setPendingIcon] = useState<string | null>(null);

  const [isExporting, setIsExporting] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const fontMenuRef = useRef<HTMLDivElement>(null);
  const bgPickerRef = useRef<HTMLElement>(null);
  const textPickerRef = useRef<HTMLElement>(null);
  // Lottie: keyed by unique id → animation data / instance
  const lottieDataRef = useRef<Map<string, object>>(new Map());
  const lottieInstancesRef = useRef<Map<string, AnimationItem>>(new Map());

  // Save settings automatically on any setting change
  useEffect(() => {
    localStorage.setItem("moonvy_font_family", fontFamily);
    localStorage.setItem("moonvy_font_size", String(fontSize));
    localStorage.setItem("moonvy_line_height", String(lineHeight));
    localStorage.setItem("moonvy_text_align", textAlign);
    localStorage.setItem("moonvy_text_color", textColor);
    localStorage.setItem("moonvy_bg_color", bgColor);
  }, [fontFamily, fontSize, lineHeight, textAlign, textColor, bgColor]);

  // Save editor content and Lottie references helper
  const saveContent = useCallback(() => {
    if (editorRef.current) {
      localStorage.setItem("moonvy_editor_content", editorRef.current.innerHTML);
    }
    localStorage.setItem("moonvy_lottie_data", JSON.stringify(Array.from(lottieDataRef.current.entries())));
  }, []);

  // Restore content and settings on mount
  useLayoutEffect(() => {
    const savedLottie = localStorage.getItem("moonvy_lottie_data");
    if (savedLottie) {
      try {
        lottieDataRef.current = new Map(JSON.parse(savedLottie));
      } catch (e) {
        console.error("Failed to load Lottie data", e);
      }
    }

    const savedContent = localStorage.getItem("moonvy_editor_content");
    if (savedContent && editorRef.current) {
      editorRef.current.innerHTML = savedContent;
    }
  }, []);

  // Preload key fonts on mount
  useEffect(() => {
    ["Anton", "Bebas Neue", "Pacifico", "Dancing Script", "Bangers", "Inter", "Playfair Display", "Montserrat"].forEach(loadGoogleFont);
  }, []);

  // pretty-color-picker: canvas background color
  useEffect(() => {
    const picker = bgPickerRef.current;
    if (!picker) return;
    const handler = (e: Event) => {
      const hex = (e as CustomEvent<{ hex: string }>).detail?.hex;
      if (hex) setBgColor(hex);
    };
    picker.addEventListener("change", handler);
    return () => picker.removeEventListener("change", handler);
  }, []);

  // Lottie: MutationObserver — initializes animations when spans are inserted, destroys on removal/undo
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const initEl = (el: Element) => {
      const id = el.getAttribute("data-lottie-id");
      if (!id || lottieInstancesRef.current.has(id)) return;
      const animData = lottieDataRef.current.get(id);
      if (!animData) return;
      const instance = lottie.loadAnimation({
        container: el as HTMLElement,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData: animData,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet", progressiveLoad: true },
      });
      lottieInstancesRef.current.set(id, instance);
    };

    const cleanupEl = (el: Element) => {
      const id = el.getAttribute?.("data-lottie-id");
      if (!id) return;
      lottieInstancesRef.current.get(id)?.destroy();
      lottieInstancesRef.current.delete(id);
      lottieDataRef.current.delete(id);
    };

    const observer = new MutationObserver((mutations) => {
      let changed = false;
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.hasAttribute("data-lottie-id")) initEl(n);
          n.querySelectorAll("[data-lottie-id]").forEach(initEl);
          changed = true;
        });
        m.removedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.hasAttribute("data-lottie-id")) cleanupEl(n);
          n.querySelectorAll("[data-lottie-id]").forEach(cleanupEl);
          changed = true;
        });
      }
      if (changed) {
        saveContent();
      }
    });

    observer.observe(editor, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [saveContent]);

  // Track cursor/selection inside editor
  useEffect(() => {
    const save = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (editorRef.current?.contains(range.startContainer)) {
        savedRangeRef.current = range.cloneRange();
      }
    };
    document.addEventListener("selectionchange", save);
    return () => document.removeEventListener("selectionchange", save);
  }, []);

  // Close font menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fontMenuRef.current && !fontMenuRef.current.contains(e.target as Node)) {
        setShowFontMenu(false);
        setFontSearch("");
        setLocalFontSearch("");
      }
    };
    if (showFontMenu) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showFontMenu]);

  // Insert HTML at cursor.
  // Uses execCommand so the insertion lands in the undo stack (Ctrl+Z works).
  // Chrome automatically appends a <br> after void/replaced elements (img, svg, span)
  // to give the cursor somewhere to live — we remove it and reposition the cursor
  // to sit directly after the inserted element, with no extra line break.
  const insertHTML = useCallback((html: string) => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (savedRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current.cloneRange());
    }

    // Append a throwaway anchor so we can locate the insertion point after the call
    const anchorId = `_ins${Date.now()}`;
    document.execCommand("insertHTML", false, html + "\u200B" + `<span id="${anchorId}"></span>`);

    // Defer cleanup until after the browser has settled the DOM
    requestAnimationFrame(() => {
      const editor = editorRef.current;
      const anchor = editor?.querySelector(`#${anchorId}`);
      if (!anchor) return;

      // Remove any <br> nodes Chrome auto-inserted right before or after our anchor
      (["previousSibling", "nextSibling"] as const).forEach((dir) => {
        let node = anchor[dir] as ChildNode | null;
        while (node?.nodeName === "BR") {
          const next = node[dir] as ChildNode | null;
          node.parentNode?.removeChild(node);
          node = next;
        }
      });

      // Place cursor immediately before the anchor (= right after inserted content)
      const currentSel = window.getSelection();
      if (currentSel) {
        const range = document.createRange();
        range.setStartBefore(anchor);
        range.collapse(true);
        currentSel.removeAllRanges();
        currentSel.addRange(range);
        savedRangeRef.current = range.cloneRange();
      }

      // Clean up the anchor element itself
      anchor.parentNode?.removeChild(anchor);
      saveContent();
    });
  }, [saveContent]);

  // Change font (global or selection)
  const changeFont = useCallback((name: string) => {
    loadGoogleFont(name);
    setFontFamily(name);
    setShowFontMenu(false);
    setFontSearch("");

    const sel = window.getSelection();
    const hasSelection = sel && !sel.isCollapsed && editorRef.current?.contains(sel.anchorNode);

    if (hasSelection) {
      document.execCommand("styleWithCSS", false, "true");
      document.execCommand("fontName", false, name);
    } else {
      if (editorRef.current) {
        editorRef.current.style.fontFamily = `'${name}', sans-serif`;
      }
    }
    editorRef.current?.focus();
  }, []);

  // Fetch local fonts via Local Font Access API (Chrome 103+)
  // Error taxonomy:
  //   SecurityError  → blocked by iframe Permissions-Policy (no browser prompt shown)
  //   NotAllowedError → user explicitly denied the permission dialog
  //   API missing    → browser doesn't support the feature
  const fetchLocalFonts = useCallback(async () => {
    if (!("queryLocalFonts" in window)) {
      setLocalFontsStatus("unsupported");
      return;
    }
    setLocalFontsStatus("loading");
    try {
      const all = await window.queryLocalFonts();
      const families = [...new Set(all.map((f) => f.family))].sort((a, b) =>
        a.localeCompare(b, "zh")
      );
      setLocalFonts(families);
      setLocalFontsStatus("success");
    } catch (err) {
      if (err instanceof DOMException) {
        if (err.name === "SecurityError") {
          // iframe Permissions-Policy blocked the call before any prompt appeared
          setLocalFontsStatus("blocked");
        } else if (err.name === "NotAllowedError") {
          // User saw the prompt and clicked "Block"
          setLocalFontsStatus("denied");
        } else {
          setLocalFontsStatus("error");
        }
      } else {
        setLocalFontsStatus("error");
      }
    }
  }, []);

  // Apply a local (system) font — no Google Fonts loading needed
  const applyLocalFont = useCallback((name: string) => {
    setFontFamily(name);
    setShowFontMenu(false);
    setLocalFontSearch("");
    const sel = window.getSelection();
    const hasSelection = sel && !sel.isCollapsed && editorRef.current?.contains(sel.anchorNode);
    if (hasSelection) {
      document.execCommand("styleWithCSS", false, "true");
      document.execCommand("fontName", false, name);
    } else {
      if (editorRef.current) editorRef.current.style.fontFamily = `'${name}', sans-serif`;
    }
    editorRef.current?.focus();
  }, []);

  // Bold / Italic
  const applyFormat = useCallback((cmd: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, undefined);
  }, []);

  // Text alignment
  const applyAlign = useCallback((align: "left" | "center" | "right") => {
    setTextAlign(align);
    editorRef.current?.focus();
    const map = { left: "justifyLeft", center: "justifyCenter", right: "justifyRight" } as const;
    document.execCommand(map[align], false, undefined);
  }, []);

  // Insert Fluent emoji as an inline animated <img> from CDN
  const insertFluentEmoji = useCallback((category: string, name: string, char: string) => {
    // Keep panel open, only close when clicking the 'X' button
    const src = fluentUrl(category, name);
    const imgStyle = "height:1em;width:auto;vertical-align:-0.15em;display:inline-block;";
    insertHTML(
      `<img src="${src}" alt="${char}" title="${name}" style="${imgStyle}" contenteditable="false" draggable="false" loading="lazy" crossorigin="anonymous" />`
    );
  }, [insertHTML]);

  // Insert native emoji character
  const insertEmoji = useCallback((char: string) => {
    // Keep panel open, only close when clicking the 'X' button
    editorRef.current?.focus();
    restoreSavedRange(savedRangeRef.current);
    document.execCommand("insertText", false, char);
    setTimeout(saveContent, 50);
  }, [saveContent]);

  // Handle animated & static media upload
  // Supported: GIF, APNG, WebP (animated), PNG, JPG → <img>
  //            SVG (static or animated via SMIL/CSS) → inline <svg>
  //            JSON (Lottie) → <span data-lottie-id> + lottie-web
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const imgStyle = "height:1em;width:auto;vertical-align:-0.15em;display:inline-block;border-radius:3px;max-width:400px;";

    // ── Lottie JSON ──────────────────────────────────────────────────────────
    const isJSON = file.type === "application/json" || file.name.toLowerCase().endsWith(".json");
    if (isJSON) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const animData = JSON.parse(ev.target?.result as string) as Record<string, unknown>;
          if (!Array.isArray(animData.layers)) {
            alert("This JSON file doesn't look like a Lottie animation (missing 'layers' array).");
            return;
          }
          const id = `lottie-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          lottieDataRef.current.set(id, animData as object);
          // Insert a placeholder span; MutationObserver will hydrate it with lottie-web
          insertHTML(
            `<span contenteditable="false" data-lottie-id="${id}" ` +
            `style="height:2em;width:2em;display:inline-block;vertical-align:-0.5em;overflow:hidden;flex-shrink:0;" ` +
            `title="Lottie animation"></span>`
          );
        } catch {
          alert("Failed to parse JSON file.");
        }
      };
      reader.readAsText(file);
      return;
    }

    // ── Animated / static SVG ─────────────────────────────────────────────────
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        const svgEl = doc.querySelector("svg");
        if (!svgEl) return;
        // Preserve SMIL / CSS animations by keeping the SVG inline
        svgEl.setAttribute("style", "height:1em;width:auto;vertical-align:-0.15em;display:inline-block;");
        svgEl.setAttribute("contenteditable", "false");
        svgEl.removeAttribute("width");
        svgEl.removeAttribute("height");
        insertHTML(svgEl.outerHTML);
      };
      reader.readAsText(file);
      return;
    }

    // ── GIF, APNG, WebP, PNG, JPG — all animate natively as <img> ────────────
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      insertHTML(`<img src="${src}" style="${imgStyle}" contenteditable="false" draggable="false" />`);
    };
    reader.readAsDataURL(file);
  }, [insertHTML]);

  // Insert Lucide icon (via hidden render → useLayoutEffect)
  const insertIcon = useCallback((name: string) => {
    // Keep panel open, only close when clicking the 'X' button
    setPendingIcon(name);
  }, []);

  // After icon renders in the hidden staging area, pull its SVG outerHTML and insertHTML (undo-safe)
  useLayoutEffect(() => {
    if (!pendingIcon || !hiddenRef.current) return;
    const svg = hiddenRef.current.querySelector("svg");
    if (!svg) return;

    const cloned = svg.cloneNode(true) as SVGElement;
    cloned.setAttribute("style", "height:1em;width:1em;vertical-align:-0.15em;display:inline-block;flex-shrink:0;");
    cloned.setAttribute("contenteditable", "false");

    insertHTML(cloned.outerHTML);
    setPendingIcon(null);
  }, [pendingIcon, insertHTML]);

  // Export as PNG image (Retina/high-res scaled by 2)
  const exportAsPNG = useCallback(async () => {
    if (!editorRef.current) return;
    setIsExporting(true);
    try {
      const width = editorRef.current.offsetWidth;
      const height = editorRef.current.offsetHeight;
      const scale = 2; // retina 2x resolution

      const dataUrl = await domtoimage.toPng(editorRef.current, {
        width: width * scale,
        height: height * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: `${width}px`,
          height: `${height}px`
        },
        bgcolor: bgColor
      });

      const link = document.createElement("a");
      link.download = `moonvy-text-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export PNG failed", err);
      alert("导出图片失败，或外部图片跨域加载受限。请检查控制台错误信息。");
    } finally {
      setIsExporting(false);
    }
  }, [bgColor]);

  // Keyboard shortcuts handler for the editor
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle backspace/delete of non-editable elements (icons, emojis, images, Lottie)
    if (e.key === "Backspace" || e.key === "Delete") {
      const sel = window.getSelection();
      if (sel && sel.isCollapsed) {
        const { anchorNode, anchorOffset } = sel;
        if (anchorNode) {
          if (e.key === "Backspace") {
            const prevEl = getPrecedingElement(anchorNode, anchorOffset, editorRef.current);
            if (prevEl && (prevEl.getAttribute("contenteditable") === "false" || prevEl.hasAttribute("data-lottie-id"))) {
              e.preventDefault();
              prevEl.remove();
              return;
            }
          } else {
            const nextEl = getSucceedingElement(anchorNode, anchorOffset, editorRef.current);
            if (nextEl && (nextEl.getAttribute("contenteditable") === "false" || nextEl.hasAttribute("data-lottie-id"))) {
              e.preventDefault();
              nextEl.remove();
              return;
            }
          }
        }
      }
    }

    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;

    switch (e.key.toLowerCase()) {
      case "b":
        e.preventDefault();
        applyFormat("bold");
        break;
      case "i":
        e.preventDefault();
        applyFormat("italic");
        break;
      case "z":
        if (e.shiftKey) {
          e.preventDefault();
          document.execCommand("redo", false, undefined);
        }
        // Ctrl+Z (no shift) — let browser handle natively so undo stack stays consistent
        break;
      case "y":
        e.preventDefault();
        document.execCommand("redo", false, undefined);
        break;
      case "a":
        // Ctrl+A — browser handles select-all natively, no override needed
        break;
      default:
        break;
    }
  }, [applyFormat]);

  // Text color change
  const applyTextColor = useCallback((color: string) => {
    setTextColor(color);
    editorRef.current?.focus();
    document.execCommand("foreColor", false, color);
  }, []);

  // pretty-color-picker: text color (must be after applyTextColor is defined)
  useEffect(() => {
    const picker = textPickerRef.current;
    if (!picker) return;
    const handler = (e: Event) => {
      const hex = (e as CustomEvent<{ hex: string }>).detail?.hex;
      if (hex) applyTextColor(hex);
    };
    picker.addEventListener("change", handler);
    return () => picker.removeEventListener("change", handler);
  }, [applyTextColor]);

  // Filtered font lists
  const fontCategories = ["All", ...Array.from(new Set(GOOGLE_FONTS.map((f) => f.category)))];
  const filteredFonts = GOOGLE_FONTS.filter((f) => {
    const matchSearch = !fontSearch || f.name.toLowerCase().includes(fontSearch.toLowerCase());
    const matchCat = fontCat === "All" || f.category === fontCat;
    return matchSearch && matchCat;
  });
  const filteredLocalFonts = localFonts.filter(
    (name) => !localFontSearch || name.toLowerCase().includes(localFontSearch.toLowerCase())
  );

  // Filtered icons
  const filteredIcons = Object.keys(ICON_MAP).filter(
    (n) => !iconSearch || n.toLowerCase().includes(iconSearch.toLowerCase())
  );

  const PendingIcon = pendingIcon ? ICON_MAP[pendingIcon] : null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0d]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hidden SVG staging area */}
      <div
        ref={hiddenRef}
        aria-hidden="true"
        style={{ position: "fixed", left: -9999, top: -9999, opacity: 0, pointerEvents: "none" }}
      >
        {PendingIcon && <PendingIcon size={fontSize} color={textColor} strokeWidth={2} />}
      </div>

      {/* Scoped styles */}
      <style>{`
        .textmix-canvas[data-placeholder]:empty::before {
          content: attr(data-placeholder);
          color: rgba(0,0,0,0.18);
          pointer-events: none;
          font-style: italic;
        }
        .textmix-canvas { caret-color: #6366f1; }
        .textmix-canvas:focus { outline: none; }
        .textmix-canvas img,
        .textmix-canvas svg { cursor: default; user-select: none; }
        /* Lottie container — keep its inner SVG from interfering with selection */
        [data-lottie-id] { cursor: default; user-select: none; pointer-events: none; }
        [data-lottie-id] * { pointer-events: none; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 99px; }
        input[type=range] { cursor: pointer; }
        input[type=color] { cursor: pointer; }
        .font-row:hover { background: rgba(255,255,255,0.05); }
        .icon-btn:hover { background: rgba(255,255,255,0.08); }
        .emoji-btn:hover { background: rgba(255,255,255,0.08); }
      `}</style>

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-2 px-4 py-2 bg-[#111114] border-b border-white/[0.07] flex-shrink-0 flex-wrap z-30">

        {/* Logo */}
        <div className="flex items-center gap-2 mr-3 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Type size={13} className="text-white" />
          </div>
          <span className="text-white font-semibold text-[13px] tracking-tight">Moonvy·Text</span>
        </div>

        <div className="w-px h-5 bg-white/[0.08] mr-1 flex-shrink-0" />

        {/* ── Font Family ── */}
        <div className="relative flex-shrink-0" ref={fontMenuRef}>
          <button
            className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] text-white px-3 py-1.5 rounded-lg text-sm transition-colors min-w-[148px] border border-white/[0.07]"
            onClick={() => setShowFontMenu((v) => !v)}
          >
            <span
              className="flex-1 text-left truncate text-[15px]"
              style={{ fontFamily: `'${fontFamily}', sans-serif` }}
            >
              {fontFamily}
            </span>
            <ChevronDown size={12} className="text-white/30 flex-shrink-0" />
          </button>

          {showFontMenu && (
            <div className="absolute top-full left-0 mt-1.5 w-[280px] bg-[#18181c] border border-white/[0.08] rounded-xl shadow-2xl shadow-black/60 z-50 flex flex-col overflow-hidden">

              {/* ── Source tabs ── */}
              <div className="flex border-b border-white/[0.07] flex-shrink-0">
                {(["google", "local"] as const).map((src) => (
                  <button
                    key={src}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors border-b-2 -mb-px ${
                      fontSource === src
                        ? "text-white border-indigo-500"
                        : "text-white/35 border-transparent hover:text-white/60"
                    }`}
                    onClick={() => setFontSource(src)}
                  >
                    {src === "google" ? <Globe size={11} /> : <Monitor size={11} />}
                    {src === "google" ? "谷歌字体" : "已安装字体"}
                    {src === "local" && localFontsStatus === "success" && (
                      <span className="bg-indigo-600/60 text-white/80 text-[9px] px-1 rounded-full leading-tight">
                        {localFonts.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── Search bar (shared) ── */}
              <div className="p-2.5 border-b border-white/[0.07] flex-shrink-0">
                <div className="flex items-center gap-2 bg-white/[0.05] rounded-lg px-3">
                  <Search size={12} className="text-white/25 flex-shrink-0" />
                  <input
                    autoFocus
                    className="flex-1 bg-transparent text-white text-sm py-2 outline-none placeholder-white/20"
                    placeholder={fontSource === "google" ? "搜索谷歌字体…" : "搜索已安装字体…"}
                    value={fontSource === "google" ? fontSearch : localFontSearch}
                    onChange={(e) =>
                      fontSource === "google"
                        ? setFontSearch(e.target.value)
                        : setLocalFontSearch(e.target.value)
                    }
                  />
                  {(fontSource === "google" ? fontSearch : localFontSearch) && (
                    <button
                      onClick={() => fontSource === "google" ? setFontSearch("") : setLocalFontSearch("")}
                      className="text-white/20 hover:text-white/50 transition-colors"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              </div>

              {/* ── Google Fonts tab ── */}
              {fontSource === "google" && (
                <>
                  {/* Category chips */}
                  <div className="flex gap-1 px-2.5 py-2 border-b border-white/[0.07] overflow-x-auto flex-shrink-0">
                    {fontCategories.map((cat) => (
                      <button
                        key={cat}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] whitespace-nowrap flex-shrink-0 transition-colors ${
                          fontCat === cat
                            ? "bg-indigo-600 text-white"
                            : "bg-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.1]"
                        }`}
                        onClick={() => setFontCat(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Font list */}
                  <div className="overflow-y-auto py-1" style={{ maxHeight: 300 }}>
                    {filteredFonts.map((font) => (
                      <button
                        key={font.name}
                        className={`font-row w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                          fontFamily === font.name ? "text-indigo-400" : "text-white/75"
                        }`}
                        style={{ fontFamily: `'${font.name}', sans-serif`, fontSize: 17 }}
                        onClick={() => changeFont(font.name)}
                        onMouseEnter={() => loadGoogleFont(font.name)}
                      >
                        <span>{font.name}</span>
                        {fontFamily === font.name && <Check size={13} className="text-indigo-400 flex-shrink-0 ml-2" />}
                      </button>
                    ))}
                    {filteredFonts.length === 0 && (
                      <div className="text-white/25 text-sm text-center py-8">没有找到字体</div>
                    )}
                  </div>
                </>
              )}

              {/* ── Local Fonts tab ── */}
              {fontSource === "local" && (
                <div className="flex flex-col">

                  {/* ── Status area ── */}
                  {localFontsStatus === "idle" && (
                    <div className="flex flex-col items-center gap-3 py-8 px-5">
                      <Monitor size={28} className="text-white/15" />
                      <p className="text-white/35 text-xs text-center leading-relaxed">
                        读取本机字体需要浏览器授权
                      </p>
                      <button
                        onClick={fetchLocalFonts}
                        className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg transition-colors font-medium"
                      >
                        <Monitor size={12} />获取本地字体
                      </button>
                    </div>
                  )}

                  {localFontsStatus === "loading" && (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-white/30 text-xs">正在读取字体列表…</p>
                    </div>
                  )}

                  {localFontsStatus === "unsupported" && (
                    <div className="flex flex-col items-center gap-2 py-7 px-5">
                      <p className="text-white/35 text-xs text-center leading-relaxed">
                        当前浏览器不支持本地字体 API
                      </p>
                      <p className="text-white/20 text-[10px] text-center">请使用 Chrome 103+ 或 Edge 103+</p>
                    </div>
                  )}

                  {/* User explicitly denied the permission dialog */}
                  {localFontsStatus === "denied" && (
                    <div className="flex flex-col items-center gap-3 py-7 px-5">
                      <p className="text-white/35 text-xs text-center leading-relaxed">
                        你在授权弹窗中拒绝了字体访问
                      </p>
                      <p className="text-white/20 text-[10px] text-center">
                        可在浏览器地址栏左侧的锁图标中重置权限，然后重试
                      </p>
                      <button
                        onClick={fetchLocalFonts}
                        className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs transition-colors"
                      >
                        <RefreshCw size={11} />重试
                      </button>
                    </div>
                  )}

                  {/* SecurityError — iframe blocked the API before any prompt */}
                  {localFontsStatus === "blocked" && (
                    <div className="flex flex-col items-center gap-2 py-7 px-5">
                      <p className="text-white/35 text-xs text-center leading-relaxed">
                        当前页面运行在 iframe 中<br />浏览器权限策略阻止了字体访问
                      </p>
                      <p className="text-white/20 text-[10px] text-center">
                        请在独立标签页中打开本工具，<br />或使用下方手动输入
                      </p>
                    </div>
                  )}

                  {localFontsStatus === "error" && (
                    <div className="flex flex-col items-center gap-3 py-7 px-5">
                      <p className="text-white/30 text-xs text-center">获取失败，请重试</p>
                      <button
                        onClick={fetchLocalFonts}
                        className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs transition-colors"
                      >
                        <RefreshCw size={11} />重试
                      </button>
                    </div>
                  )}

                  {/* Font list on success */}
                  {localFontsStatus === "success" && (
                    <>
                      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06] flex-shrink-0">
                        <span className="text-white/25 text-[10px]">共 {localFonts.length} 个字体</span>
                        <button
                          onClick={fetchLocalFonts}
                          className="flex items-center gap-1 text-white/30 hover:text-white/60 text-[10px] transition-colors"
                        >
                          <RefreshCw size={10} />刷新
                        </button>
                      </div>
                      <div className="overflow-y-auto py-1" style={{ maxHeight: 220 }}>
                        {filteredLocalFonts.map((name) => (
                          <button
                            key={name}
                            className={`font-row w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors ${
                              fontFamily === name ? "text-indigo-400" : "text-white/75"
                            }`}
                            style={{ fontFamily: `'${name}', sans-serif`, fontSize: 15 }}
                            onClick={() => applyLocalFont(name)}
                          >
                            <span className="truncate">{name}</span>
                            {fontFamily === name && <Check size={13} className="text-indigo-400 flex-shrink-0 ml-2" />}
                          </button>
                        ))}
                        {filteredLocalFonts.length === 0 && (
                          <div className="text-white/25 text-sm text-center py-6">没有找到字体</div>
                        )}
                      </div>
                    </>
                  )}

                  {/* ── Common system fonts quick-pick ── */}
                  {localFontsStatus !== "loading" && localFontsStatus !== "success" && (
                    <div className="border-t border-white/[0.07] px-3 pt-3 pb-2">
                      <p className="text-white/20 text-[10px] mb-2">常用系统字体</p>
                      <div className="flex flex-wrap gap-1">
                        {[
                          "PingFang SC", "微软雅黑", "黑体", "宋体", "楷体",
                          "Helvetica Neue", "Arial", "Georgia", "Times New Roman", "Courier New",
                        ].map((name) => (
                          <button
                            key={name}
                            className="px-2 py-0.5 rounded text-[10px] bg-white/[0.06] text-white/45 hover:bg-white/[0.12] hover:text-white/80 transition-colors"
                            style={{ fontFamily: `'${name}', sans-serif` }}
                            onClick={() => applyLocalFont(name)}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Manual font name input (always visible as fallback) ── */}
                  <div className="border-t border-white/[0.07] px-3 pt-3 pb-3">
                    <p className="text-white/20 text-[10px] mb-2">手动输入字体名称</p>
                    <div className="flex gap-1.5">
                      <input
                        className="flex-1 bg-white/[0.05] border border-white/[0.08] focus:border-indigo-500/50 text-white text-xs px-3 py-1.5 rounded-lg outline-none placeholder-white/20 transition-colors"
                        placeholder="如：苹方、微软雅黑、Arial…"
                        value={manualFontInput}
                        onChange={(e) => setManualFontInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && manualFontInput.trim()) {
                            applyLocalFont(manualFontInput.trim());
                            setManualFontInput("");
                          }
                        }}
                      />
                      <button
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-xs px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                        disabled={!manualFontInput.trim()}
                        onClick={() => {
                          if (manualFontInput.trim()) {
                            applyLocalFont(manualFontInput.trim());
                            setManualFontInput("");
                          }
                        }}
                      >
                        应用
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}
        </div>

        {/* ── Font Size ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <input
            type="range" min={12} max={200} value={fontSize}
            onChange={(e) => {
              const v = Number(e.target.value);
              setFontSize(v);
              if (editorRef.current) editorRef.current.style.fontSize = `${v}px`;
            }}
            className="w-20 accent-indigo-500"
            style={{ height: 2 }}
          />
          <input
            type="number" min={12} max={200} value={fontSize}
            onChange={(e) => {
              const v = Math.min(200, Math.max(12, Number(e.target.value) || 12));
              setFontSize(v);
              if (editorRef.current) editorRef.current.style.fontSize = `${v}px`;
            }}
            className="w-14 bg-white/[0.05] text-white text-[12px] px-2 py-1 rounded-md outline-none text-center border border-white/[0.07] focus:border-indigo-500/50"
          />
        </div>

        {/* ── Line height ── */}
        <div className="flex items-center gap-1.5 flex-shrink-0" title="Line height">
          <span className="text-white/25 text-[11px] font-mono select-none">↕</span>
          <input
            type="range" min={0.8} max={3} step={0.05} value={lineHeight}
            onChange={(e) => {
              const v = Number(e.target.value);
              setLineHeight(v);
              if (editorRef.current) editorRef.current.style.lineHeight = String(v);
            }}
            className="w-14 accent-indigo-500"
            style={{ height: 2 }}
          />
        </div>

        <div className="w-px h-5 bg-white/[0.08] flex-shrink-0" />

        {/* ── Bold / Italic ── */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            className="p-1.5 hover:bg-white/[0.08] rounded-md text-white/50 hover:text-white transition-colors"
            onClick={() => applyFormat("bold")} title="Bold (Ctrl+B)"
          >
            <Bold size={14} />
          </button>
          <button
            className="p-1.5 hover:bg-white/[0.08] rounded-md text-white/50 hover:text-white transition-colors"
            onClick={() => applyFormat("italic")} title="Italic (Ctrl+I)"
          >
            <Italic size={14} />
          </button>
        </div>

        {/* ── Alignment ── */}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {([["left", AlignLeft], ["center", AlignCenter], ["right", AlignRight]] as const).map(([align, Icon]) => (
            <button
              key={align}
              className={`p-1.5 rounded-md transition-colors ${
                textAlign === align
                  ? "bg-indigo-600/30 text-indigo-300"
                  : "text-white/50 hover:text-white hover:bg-white/[0.08]"
              }`}
              onClick={() => applyAlign(align)}
              title={`Align ${align}`}
            >
              <Icon size={14} />
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-white/[0.08] flex-shrink-0" />

        {/* ── Colors ── */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Text color — pretty-color-picker */}
          <div className="relative">
            <button
              id="text-color-anchor"
              className="flex flex-col items-center gap-0.5 p-1.5 hover:bg-white/[0.08] rounded-md cursor-pointer transition-colors"
              title="字体颜色"
              onClick={() => (textPickerRef.current as any)?.toggle()}
            >
              <span className="text-white/60 text-sm font-bold leading-none" style={{ fontFamily: "serif" }}>A</span>
              <div className="w-3.5 h-[3px] rounded-full" style={{ backgroundColor: textColor }} />
            </button>
            <pretty-color-picker
              ref={textPickerRef as any}
              value={textColor}
              mode="popover"
              theme="dark"
              label="字体颜色"
              anchor="#text-color-anchor"
              header-action="close"
            />
          </div>

          {/* Canvas background — pretty-color-picker web component */}
          <div className="relative">
            <button
              id="bg-color-anchor"
              className="flex flex-col items-center gap-0.5 p-1.5 hover:bg-white/[0.08] rounded-md cursor-pointer transition-colors"
              title="画布背景色"
              onClick={() => (bgPickerRef.current as any)?.toggle()}
            >
              <Palette size={13} className="text-white/50" />
              <div className="w-3.5 h-[3px] rounded-full border border-white/[0.15]" style={{ backgroundColor: bgColor }} />
            </button>
            <pretty-color-picker
              ref={bgPickerRef as any}
              value={bgColor}
              mode="popover"
              theme="dark"
              label="画布背景"
              anchor="#bg-color-anchor"
              header-action="close"
            />
          </div>
        </div>

        <div className="flex-1 min-w-2" />

        {/* ── Insert actions ── */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Upload image / SVG */}
          <button
            className="flex items-center gap-1.5 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.07] text-white/70 hover:text-white px-3 py-1.5 rounded-lg text-[12px] transition-colors"
            onClick={() => fileInputRef.current?.click()}
            title="Insert image or animation&#10;Supports: GIF · APNG · WebP · SVG · Lottie JSON"
          >
            <ImagePlus size={14} />
            <span>Image / GIF</span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*,.svg,.json" className="hidden" onChange={handleFileChange} />

          {/* Emoji toggle */}
          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${
              showEmojiPanel
                ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                : "bg-white/[0.05] border-white/[0.07] text-white/70 hover:text-white hover:bg-white/[0.09]"
            }`}
            onClick={() => setShowEmojiPanel((v) => !v)}
          >
            <span className="text-base leading-none">😀</span>
            <span>Emoji</span>
          </button>

          {/* Icons toggle */}
          <button
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${
              showIconPanel
                ? "bg-violet-500/15 text-violet-300 border-violet-500/30"
                : "bg-white/[0.05] border-white/[0.07] text-white/70 hover:text-white hover:bg-white/[0.09]"
            }`}
            onClick={() => setShowIconPanel((v) => !v)}
          >
            <Sparkles size={14} />
            <span>Icons</span>
          </button>
        </div>

        <div className="w-px h-5 bg-white/[0.08] flex-shrink-0" />

        {/* ── Export actions ── */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/[0.05] disabled:text-white/20 text-white px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors shadow-lg shadow-indigo-600/10 cursor-pointer"
            onClick={exportAsPNG}
            disabled={isExporting}
            title="导出为静态高清 PNG 图片 (2x Retina 像素)"
          >
            <Camera size={13} />
            <span>{isExporting ? "生成中..." : "导出图片"}</span>
          </button>
        </div>
      </header>

      {/* ── Main Layout (Canvas + Sidebar) ─────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor & Shortcuts */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <div className="flex-1 overflow-auto" style={{ backgroundColor: bgColor }}>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="textmix-canvas min-h-full p-12 md:p-16"
              onKeyDown={handleKeyDown}
              onInput={saveContent}
              data-placeholder="Start typing here… mix in 🎨 emoji, 🖼️ images, and ✦ icons anywhere"
              style={{
                fontFamily: `'${fontFamily}', sans-serif`,
                fontSize: `${fontSize}px`,
                color: textColor,
                lineHeight: lineHeight,
                textAlign: textAlign,
                wordBreak: "break-word",
                minHeight: "100%",
              }}
            />
          </div>

          {/* Shortcuts hint bar */}
          <div className="flex items-center justify-center gap-4 px-4 py-2 bg-[#0a0a0d] border-t border-white/[0.05] flex-shrink-0 flex-wrap z-10">
            {[
              ["⌘Z", "撤销"], ["⌘⇧Z", "重做"], ["⌘B", "加粗"],
              ["⌘I", "斜体"], ["⌘C", "复制"], ["⌘V", "粘贴"],
              ["⌘X", "剪切"], ["⌘A", "全选"],
            ].map(([key, label]) => (
              <span key={key} className="flex items-center gap-1">
                <kbd className="text-[10px] bg-white/[0.07] text-white/40 px-1.5 py-0.5 rounded font-mono border border-white/[0.08]">{key}</kbd>
                <span className="text-white/25 text-[10px]">{label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: Sidebar */}
        {(showEmojiPanel || showIconPanel) && (
          <div className="w-[320px] border-l border-white/[0.07] bg-[#111114] flex flex-col flex-shrink-0 divide-y divide-white/[0.06] overflow-hidden">
            {/* ── Emoji Panel ─────────────────────────────────────────────────── */}
            {showEmojiPanel && (
              <div className="flex flex-col flex-1 min-h-0">
                {/* Header: source toggle + close */}
                <div className="flex flex-col flex-shrink-0 border-b border-white/[0.06] gap-2">
                  {/* Line 1: Source tabs + Close button */}
                  <div className="flex items-center justify-between px-3 pt-2.5">
                    <div className="flex rounded-lg overflow-hidden border border-white/[0.08] flex-shrink-0">
                      {(["fluent", "system"] as const).map((src) => (
                        <button
                          key={src}
                          className={`px-3 py-1 text-[11px] font-medium transition-colors ${
                            emojiSource === src
                              ? "bg-white/[0.12] text-white"
                              : "text-white/35 hover:text-white/60"
                          }`}
                          onClick={() => setEmojiSource(src)}
                        >
                          {src === "system" ? "系统 Emoji" : "✦ Fluent"}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setShowEmojiPanel(false)} className="text-white/25 hover:text-white/60 flex-shrink-0 transition-colors cursor-pointer p-1">
                      <X size={15} />
                    </button>
                  </div>

                  {/* Line 2: Category tabs (scrollable) - occupies its own line */}
                  <div className="flex gap-1 px-3 pb-2.5 overflow-x-auto min-w-0 scrollbar-none">
                    {Object.keys(emojiSource === "system" ? EMOJI_CATS : FLUENT_EMOJI_CATS).map((cat) => {
                      const active = emojiSource === "system" ? cat === emojiCat : cat === fluentCat;
                      return (
                        <button
                          key={cat}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] whitespace-nowrap flex-shrink-0 transition-colors ${
                            active
                              ? emojiSource === "system"
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-indigo-500/20 text-indigo-300"
                              : "bg-white/[0.06] text-white/35 hover:text-white/60"
                          }`}
                          onClick={() => emojiSource === "system" ? setEmojiCat(cat) : setFluentCat(cat)}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* System emoji grid */}
                {emojiSource === "system" && (
                  <div className="px-3 py-2.5 grid gap-0.5 overflow-y-auto flex-1" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))" }}>
                    {EMOJI_CATS[emojiCat].map((emoji) => (
                      <button
                        key={emoji}
                        className="emoji-btn text-2xl p-1.5 rounded-lg transition-colors text-center leading-none cursor-pointer"
                        onClick={() => insertEmoji(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Fluent emoji image grid (animated PNG) */}
                {emojiSource === "fluent" && (
                  <div className="px-3 py-2.5 grid gap-1 overflow-y-auto flex-1" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))" }}>
                    {(FLUENT_EMOJI_CATS[fluentCat] ?? []).map(([char, category, name]) => (
                      <button
                        key={`${category}/${name}`}
                        className="emoji-btn flex flex-col items-center gap-0.5 p-1.5 rounded-xl transition-colors group cursor-pointer"
                        onClick={() => insertFluentEmoji(category, name, char)}
                        title={name}
                      >
                        <img
                          src={fluentUrl(category, name)}
                          alt={char}
                          loading="lazy"
                          className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
                          onError={(e) => {
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-2xl leading-none">${char}</span>`;
                              parent.onclick = () => insertEmoji(char);
                            }
                          }}
                        />
                        <span className="text-white/20 text-[8px] truncate w-full text-center leading-tight group-hover:text-white/40 transition-colors">{char}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Icon Panel ──────────────────────────────────────────────────── */}
            {showIconPanel && (
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex items-center gap-3 px-4 pt-3 pb-2 flex-shrink-0">
                  <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.07] rounded-lg px-3 flex-1">
                    <Search size={12} className="text-white/25 flex-shrink-0" />
                    <input
                      autoFocus
                      className="flex-1 bg-transparent text-white text-sm py-2 outline-none placeholder-white/20"
                      placeholder="Search icons…"
                      value={iconSearch}
                      onChange={(e) => setIconSearch(e.target.value)}
                    />
                    {iconSearch && (
                      <button onClick={() => setIconSearch("")} className="text-white/20 hover:text-white/50 transition-colors">
                        <X size={11} />
                      </button>
                    )}
                  </div>
                  <button onClick={() => setShowIconPanel(false)} className="text-white/25 hover:text-white/60 transition-colors flex-shrink-0 cursor-pointer">
                    <X size={15} />
                  </button>
                </div>

                <div className="px-4 pb-4 grid gap-1 overflow-y-auto flex-1" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(56px, 1fr))" }}>
                  {filteredIcons.map((name) => {
                    const Icon = ICON_MAP[name];
                    return (
                      <button
                        key={name}
                        className="icon-btn flex flex-col items-center gap-1 p-2.5 rounded-xl transition-colors group cursor-pointer"
                        onClick={() => insertIcon(name)}
                        title={name}
                      >
                        <Icon size={22} className="text-white/60 group-hover:text-white transition-colors" />
                        <span className="text-white/25 group-hover:text-white/50 text-[9px] truncate w-full text-center leading-tight transition-colors">
                          {name}
                        </span>
                      </button>
                    );
                  })}
                  {filteredIcons.length === 0 && (
                    <p className="text-white/25 text-sm col-span-full text-center py-6">No icons found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
