# RME Zero To Hero — Writing Projects

## What This Is
Two writing projects for Radio Made Easy (radiomadeeasy.com), maintained as JavaScript source files that generate Word documents using the `docx` npm package.

### Speech Document (`speech_doc.js` → `RME_Introductory_Speech.docx`)
Opening speech for every Zero to Hero Radio Operator class. Three sections:
1. Original cleaned transcript (all Evan's words)
2. Improved delivery version with cues and highlighting
3. Bullet point delivery guide

**Status:** Largely complete. Changes should be minimal and intentional.

### Book Document (`book_doc.js` → `ZeroToHero_RadioOperator_Book.docx`)
How-to instructional book with personal narrative. Working title: "Zero to Hero Radio Operator."

**Status:** Active draft. Five chapters so far. Gold `[ EXPAND ]` notes flag sections needing more detail.

**Current chapters:**
1. The Conversation That Started Everything
2. The Internet Was Not Very Helpful
3. First Contact (Oscar Norris W4OXH)
4. Allowed versus Able (Tactical Response influence)
5. 413 Slides (first class, curriculum evolution)

## Regenerating Documents
```
node speech_doc.js
node book_doc.js
```

## Highlighting System — CRITICAL
Two-tier system to distinguish Evan's words from AI-added prose:
- `body(text)` — Evan's words, plain (no highlight)
- `bodyAI(text)` — AI-added paragraph, yellow highlight
- `bodyMixed([...])` — mixed attribution, array of `[text, isAI]` pairs

**Rules:**
- Evan's dictated words → `body()` or plain segments in `bodyMixed()`
- Anything AI adds, expands, infers, or invents → `bodyAI()` or highlighted segment in `bodyMixed()`
- When in doubt, highlight it
- Never blend AI additions into unmarked prose

## Style and Tone
- No em dashes anywhere. Use new sentences, commas, or colons.
- First person, conversational but considered. Not academic.
- Instructional how-to with personal story, not memoir.
- Do not flatter the amateur radio community (gatekept/unwelcoming — that's why RME exists).
- Tactical Response / Fighting Pistol references are genuine influences, not name-drops.
- "Allowed versus able" is a core philosophical pillar.
- Oscar Norris W4OXH deserves specific, grounded detail. Not a symbol.
- Key phrases: "you cannot unring that bell", "prevail when it matters most", "handed them a wall when they needed a ramp", "allowed versus able"

## Workflow
Evan dictates text and gives instructions like "add this to Chapter Four" or "this is a new chapter."
- Edit the appropriate JS file
- Regenerate the Word document
- Confirm what changed
- Do not rewrite established content unless asked
- Stay as close to Evan's words as possible
- Ask before editing if anything is ambiguous
