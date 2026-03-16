const {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, LevelFormat, BorderStyle, PageNumber,
  Footer, PageBreak
} = require('docx');
const fs = require('fs');

const NAVY = "1F3C6E";
const BLUE = "4A90D9";
const GOLD = "B8860B";
const GRAY = "666666";

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function chapterHead(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 32, font: "Georgia", color: NAVY })],
    spacing: { before: 560, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 5, color: BLUE, space: 6 } }
  });
}

// Evan's words - plain text
function body(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 24, font: "Georgia", color: "111111" })],
    spacing: { before: 0, after: 240 },
    indent: { firstLine: 720 }
  });
}

// AI-added paragraph - yellow highlight
function bodyAI(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 24, font: "Georgia", color: "111111", highlight: "yellow" })],
    spacing: { before: 0, after: 240 },
    indent: { firstLine: 720 }
  });
}

// Mixed paragraph - array of [text, isAI] pairs
function bodyMixed(segments) {
  return new Paragraph({
    children: segments.map(([text, isAI]) => new TextRun({
      text, size: 24, font: "Georgia", color: "111111",
      highlight: isAI ? "yellow" : undefined
    })),
    spacing: { before: 0, after: 240 },
    indent: { firstLine: 720 }
  });
}

function expandNote(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: "[ EXPAND: ", bold: true, size: 20, font: "Arial", color: GOLD }),
      new TextRun({ text, size: 20, font: "Arial", color: GOLD }),
      new TextRun({ text: " ]", bold: true, size: 20, font: "Arial", color: GOLD }),
    ],
    spacing: { before: 120, after: 200 },
    indent: { left: 480 },
    shading: { fill: "FFF3CD" },
    border: { left: { style: BorderStyle.SINGLE, size: 14, color: GOLD, space: 10 } }
  });
}

function divider() {
  return new Paragraph({
    children: [new TextRun("")],
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 4 } },
    spacing: { before: 360, after: 360 }
  });
}

function legendNote() {
  return new Paragraph({
    children: [
      new TextRun({ text: "Highlighting key:  plain text = your words     ", size: 18, font: "Arial", color: GRAY, italic: true }),
      new TextRun({ text: "yellow = AI-added prose", size: 18, font: "Arial", italic: true, highlight: "yellow" }),
    ],
    spacing: { before: 0, after: 400 }
  });
}

function makeFooter(chap) {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Zero to Hero Radio Operator  |  " + chap + "  |  Page ", size: 18, color: "999999", font: "Arial" }),
        new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "999999", font: "Arial" })
      ]
    })]
  });
}

const pageProps = {
  size: { width: 12240, height: 15840 },
  margin: { top: 1584, right: 1440, bottom: 1584, left: 1440 }
};

const ch1 = [
  chapterHead("Chapter One: The Conversation That Started Everything"),
  legendNote(),

  bodyMixed([
    ["About fifteen years ago, I was sitting in a cubicle at a large bank in Charlotte, North Carolina, doing what IT professionals at large banks in Charlotte do: waiting for the next ticket, watching the clock, and trying to remember why I had chosen this career path. The answer, I suspect, was the same as most of my colleagues. You do not so much choose to work IT at a bank in Charlotte as you end up there. ", true],
    ["There is a saying in the industry, at least in that part of the world: if you are in IT, you have to do your time at a bank, much like doing your time in prison. ", false],
    ["Most of us were just trying to finish our sentences.", true],
  ]),

  bodyAI("The man sitting across from me was closer to parole than I was. He was a quiet, methodical guy who kept to himself, counted his days, and had his retirement mapped out with the precision of someone who had been waiting a long time to get back to the things that actually mattered to him. One of those things, I was about to accidentally discover, was amateur radio."),

  expandNote("Add more texture here about the office environment, your relationship with this coworker, what the culture was like. What did a typical day look like? This grounds the reader before the turn."),

  bodyMixed([
    ["He mentioned, almost in passing, that he was headed to Texas on vacation to pick up radio gear from a friend he had met over the radio. ", false],
    ["I heard the words, registered the geography, and felt something click in my brain that I could not immediately name.", true],
  ]),

  bodyAI("Texas. From North Carolina. On a radio."),

  bodyAI("I did the math quietly. That was roughly twelve hundred miles. And he was not talking about a satellite phone or some exotic military technology. He was talking about a hobby radio. A thing people used to talk to strangers."),

  bodyAI("I had encountered ham radio before, the way most people have, in the background of old movies or in throwaway references. It had always registered as a relic. Something retirees did in garages. Something with a lot of knobs and not a lot of relevance. But this was different. This was a real person, sitting three feet from me, who had made a friend in Texas on a radio and was now driving there to meet him."),

  body("You cannot unring that bell."),

  expandNote("This is a strong beat. Consider slowing down here. What did it feel like to have that realization? What does it mean to have a bell you cannot unring? A paragraph or two of interiority here would land well in a book."),

  bodyMixed([
    ["I barely got started on my questions before I read the room. ", false],
    ["The vibe was clear: he was not interested in becoming my guide into this hobby. He had mentioned it in passing, not as an invitation. ", true],
    ["He was almost done serving out his sentence and he wanted to gracefully sail off into retirement without a young whippersnapper in tow. I read the room and backed off after little more than a surface-level acknowledgment that yes, radio was a thing he did.", false],
  ]),

  bodyMixed([
    ["Looking back, I wonder if I read it wrong. ", false],
    ["He may have been more willing to talk than I gave him credit for. He may have warmed up if I had pressed a little more gently, or asked better questions, or caught him at a different moment. I will never know. What I know is that I left that conversation with a question I could not put down and no one to help me answer it. That missed opportunity, real or imagined, is probably what sent me to the internet. And the internet, as we will get to shortly, was not particularly helpful.", true],
  ]),
];

const ch2 = [
  chapterHead("Chapter Two: The Internet Was Not Very Helpful"),
  legendNote(),

  bodyAI("So I did what any millennial without a real-life mentor does: I turned to the internet."),

  bodyAI("This was not the internet of today. It was a less polished, less indexed, and in some ways less trustworthy place. But it was still the internet, and the internet has always been a treasure trove if you are willing to wade through the swamp to find the treasure. In the world of amateur radio, the swamp was considerable."),

  expandNote("This is a rich area for a how-to book. Consider a short sidebar or paragraph here that names the specific types of bad information you encountered. What were the most common wrong answers? What made them feel credible? This helps readers recognize the same traps."),

  bodyMixed([
    ["What I discovered was this: roughly half of the information available online about how to get started with radio was wrong. Not a little wrong. Just wrong. ", false],
    ["Misinformed at the source, copied by someone who did not know it was misinformed, repeated until it had the patina of authority. Technical explanations that started with a false premise and built logically from there. Beginner guides written by people who had forgotten what it was like to be a beginner. Forums where the answer to every question was a longer, more technical question in return.", true],
  ]),

  bodyMixed([
    ["But every once in a while, you would come across something that helped you, gave you the will to live, and you would keep on trudging through. ", false],
    ["A forum post from someone who explained things like they remembered being confused. A YouTube video that skipped the jargon and just showed you what to do. A website that was three years out of date but still had the one piece of information you needed to take the next step. You kept those. You bookmarked them. You kept trudging.", true],
  ]),

  bodyAI("That process, of sifting through noise for signal, of almost giving up and then finding the one thing that gave you the will to continue, is familiar to almost everyone who has tried to learn amateur radio on their own. It is also, I would argue, the reason this book exists. There should have been a better on-ramp. There still should be."),
];

const ch3 = [
  chapterHead("Chapter Three: First Contact"),
  legendNote(),

  body("After some time, I managed to order a radio and a couple of antennas, got it programmed through CHIRP, and turned it on to one of the local repeaters in the Charlotte area."),

  expandNote("Walk the reader through what this process actually looked like. What radio did you get? What was CHIRP like for a first-timer? What is a repeater and why does it matter? This is instructional territory and deserves a fuller treatment, either here or in a companion chapter."),

  bodyMixed([
    ["I remember the moment clearly. ", true],
    ["The radio was the size of a large walkie-talkie. I was standing in my dining room. And this little device was picking up conversations between people who were counties apart. I stood there and just listened.", false],
  ]),

  bodyAI("Then I spent a few months doing just that: listening. I had recently passed my amateur radio exam and received my call sign, but having a license and actually keying up on a live repeater are two different things. There is a moment of hesitation that I think most new operators know. The fear that you will do something wrong, say something wrong, or simply not be heard at all."),

  bodyMixed([
    ["Eventually I braved it. ", false],
    ["My first real transmission went out on the W4CQ repeater, and the voice that came back to me belonged to Oscar Norris, call sign W4OXH.", true],
  ]),

  bodyMixed([
    ["Oscar came back almost immediately, but with a problem. He could not hear me well. His advice was simple and direct: hold the radio very still, and speak clearly into it. ", false],
    ["That might sound like nothing, but it is actually one of the most practically useful pieces of guidance a new handheld radio operator can receive. When you are running low power and relying on a small antenna to hit a distant repeater, the orientation and stability of that antenna matters more than most people expect. ", true],
    ["I did exactly what he said. I held the radio still, spoke deliberately, and keyed up again.", false],
  ]),

  bodyMixed([
    ["He could hear me. He gave me a signal report. We had a brief conversation. ", false],
    ["It was not long, and I do not remember most of what was said. ", true],
    ["What I remember is that I was elated. I was standing in my home in Iron Station, North Carolina, talking to a man in a nursing home in Gastonia, ", false],
    ["on a handheld radio the size of a TV remote, ", true],
    ["and it was working.", false],
  ]),

  bodyMixed([
    ["What I did not know at the time was ", true],
    ["that he was blind, elderly, and that the W4CQ repeater was essentially his social world. He sat in his room and talked on it for much of the day, part of a loose community of regulars who had congregated on that frequency over decades. The repeater had tremendous range and had become, without anyone planning it, a gathering place. People checked in, caught up, kept tabs on one another. Oscar was a vital part of that network. ", false],
    ["It was a real community. Just a verbal one, conducted over radio waves.", true],
  ]),

  expandNote("If you have any specific memories of conversations with Oscar, or anything else you learned about him over time, this is the place for it. Even a small detail would make this land harder."),

  bodyMixed([
    ["He passed away a few years later. ", false],
    ["I am glad that when I finally braved that first transmission, he was the one who answered.", true],
  ]),

  bodyMixed([
    ["I eventually earned my amateur radio license, made some contacts, and did not make it my whole personality. I moved on. ", false],
    ["That was not the point. The point was that I had proved to myself that the door was real and that I could walk through it. That was enough, for a while.", true],
  ]),
];

const ch4 = [
  chapterHead("Chapter Four: Allowed versus Able"),
  legendNote(),

  bodyMixed([
    ["My next chapter took me in a direction that might seem unrelated: ", true],
    ["firearms and medical training. I traveled to Tennessee and trained at a school called Tactical Response, and from there I got plugged into a community of people who took preparedness seriously across multiple disciplines.", false],
  ]),

  expandNote("This transition is worth more space in the book. What drew you to tactical training? How does it connect to the broader worldview that led you to radio in the first place? Readers coming from a preparedness background will recognize this path. Readers who are not will benefit from understanding it."),

  bodyMixed([
    ["Tactical Response had a profound influence on how I think about teaching, not just about shooting. Their flagship course, Fighting Pistol, is one of the most well-designed pieces of curriculum I have ever encountered. The philosophy behind it stuck with me: stop optimizing for the approval of internet gurus and social media audiences, and start equipping ordinary people with real, practical competence that holds up when it actually matters. ", false],
    ["The emphasis is not on gear. It is not on credentials or the appearance of expertise. It is on building a capable, thinking human being who can perform under pressure with whatever tools are available. That philosophy shaped how I approach radio instruction more than anything else I have encountered.", true],
  ]),

  bodyMixed([
    ["I have had students compare this class to Fighting Pistol, calling it the Fighting Pistol of radio. ", false],
    ["I want to be careful not to overclaim that. Comparing anything I have built to that curriculum is generous to the point of embarrassment. But I take the spirit of the comparison seriously, because it is exactly what I am reaching for: the same commitment to practical outcomes over theoretical knowledge, the same respect for the student\u2019s time and investment, the same belief that the common person, properly taught, is more than capable of real competence.", true],
  ]),

  bodyMixed([
    ["One concept from that world has stayed with me, and it translates directly into how I teach radio. ", true],
    ["It is the distinction between allowed and able.", false],
  ]),

  bodyAI("In the firearms community, there is a certain kind of instructor who is consumed by what is permitted in which jurisdiction: what the law says you may carry, where you may carry it, and under what circumstances you are legally justified in acting. That knowledge has its place. But there is a separate and arguably more important question: what are you actually able to do when a situation demands it? What are you capable of, trained for, and ready to execute? Allowed and able are not the same thing, and they do not always overlap."),

  bodyAI("Radio has its own version of this dynamic. The amateur radio world, in particular, has no shortage of people who are deeply invested in the rules. Licensing structures, band plans, permitted power levels, proper procedure. Again, that knowledge has its place. But if your goal is to be genuinely useful in a difficult situation, to communicate when communication matters most, the more important question is whether you are able. Whether you have the skills, the equipment, the practiced familiarity with your gear to actually get a message through when it counts. A license does not make you a radio operator any more than a carry permit makes you capable under pressure."),

  bodyMixed([
    ["What you are allowed to do and what you are able to do are two different conversations. ", false],
    ["This book is primarily about the second one. My goal is to send you home able, ", true],
    ["because able is what lets you prevail when it matters most.", false],
  ]),

  bodyMixed([
    ["In that training community, I started to notice something consistent. The people around me understood the value of communication. Many of them had heard of the fighting triad: shoot, move, communicate. ", false],
    ["They knew that a radio was a tool they were supposed to have. But very few of them could actually make their radios work. Programming was a mystery. Frequencies were a foreign language. They had the gear but not the knowledge, and the gap between having a radio and being a radio operator was wider than most of them had expected.", true],
  ]),

  body("I was not the only person in that community known for radio. There were others who had earned the same reputation, and I want to be clear about that. But I was one of them, and that was enough to put me in a position I had not expected to be in. People started asking me not just to fix their radios, but to explain what I was doing. And eventually, to teach."),

  bodyAI("I said yes. That was, in retrospect, a pivotal decision that led somewhere I could not have predicted."),
];

const ch5 = [
  chapterHead("Chapter Five: 413 Slides"),
  legendNote(),

  bodyMixed([
    ["My first attempt at teaching radio ", true],
    ["was exactly what you would expect from someone with a background in corporate IT who had never taught anything before. ", true],
    ["I built a PowerPoint presentation. It had 413 slides. It covered every technical detail I had managed to accumulate over years of self-directed learning. The students in that room found it useful. They told me so.", false],
  ]),

  bodyMixed([
    ["But I knew something was wrong. ", false],
    ["I had set out to build the class I wished had existed when I was starting out, and what I had built instead was a technical reference that happened to be delivered out loud. That is not the same thing. The people in that room learned something. They did not leave as radio operators.", true],
  ]),

  expandNote("This is a rich area to develop. What did you set out to build versus what you actually built? What did the gap look like from the front of the room? What specific moment or observation made you realize the approach needed to change? Specifics here will help readers understand the difference between delivering information and actually teaching."),

  bodyAI("That gap between what I intended and what I produced was the most useful piece of information I had ever collected about teaching. It sent me back to the drawing board, and the drawing board after that, and the one after that. Knowing a subject deeply and being able to transfer it to someone else are not the same skill. The students did not need everything I knew. They needed the right things, in the right order, connected to something they already understood. They needed a ramp, not a wall. And I had handed them a wall with a very thorough index."),

  bodyAI("Everything that came after that class was an attempt to build a better ramp."),

  bodyMixed([
    ["What exists today is roughly eighty evolutions later. ", false],
    ["The curriculum has been torn down and rebuilt more times than I can count. Content has been added, cut, reorganized, and field-tested in front of hundreds of students in rooms across the country. Every class taught me something about what worked and what did not. Every confused face in the audience was data. Every moment when I watched something click for a student was a signal to do more of whatever had just happened.", true],
  ]),

  expandNote("Consider a brief summary here of the evolution arc. What were the biggest shifts? Going from all technical to mostly practical? Adding scenarios? Cutting the license exam content? Readers interested in the pedagogy will appreciate a glimpse behind the curtain."),

  bodyAI("The class I teach today is the class I wish had existed when I started. That is not a marketing line. It is the organizing principle behind every decision I have made about what to include, what to cut, and how to sequence the material. If the fifteen-years-ago version of me, sitting in that cubicle, freshly ignited by a story about Texas and a radio, could have walked into this class the following weekend, it would have saved him years."),

  bodyAI("That is why I built it. And that is why you are holding this book."),

  divider(),

  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "[ Draft ends here  \u00B7  Continue adding chapters below ]", size: 20, font: "Arial", color: "AAAAAA", italic: true })],
    spacing: { before: 320, after: 0 }
  })
];

const bookDoc = new Document({
  styles: {
    default: { document: { run: { font: "Georgia", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Georgia", color: NAVY },
        paragraph: { spacing: { before: 560, after: 200 }, outlineLevel: 0 } }
    ]
  },
  sections: [
    {
      properties: { page: pageProps },
      footers: { default: makeFooter("Draft") },
      children: [
        new Paragraph({ children: [new TextRun("")], spacing: { before: 2160, after: 0 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Zero to Hero", bold: true, size: 72, font: "Georgia", color: NAVY })], spacing: { before: 0, after: 120 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Radio Operator", bold: true, size: 56, font: "Georgia", color: NAVY })], spacing: { before: 0, after: 240 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "by Evan Dixon", size: 28, font: "Georgia", color: GRAY, italic: true })], spacing: { before: 0, after: 1200 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Radio Made Easy", size: 24, font: "Georgia", color: BLUE })], spacing: { before: 0, after: 80 } }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "radiomadeeasy.com", size: 20, font: "Arial", color: GRAY, italic: true })] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Working Draft  \u00B7  Plain text = your words     ", size: 18, font: "Arial", color: GRAY, italic: true }),
            new TextRun({ text: "Yellow = AI-added prose", size: 18, font: "Arial", italic: true, highlight: "yellow" })
          ],
          spacing: { before: 1440, after: 0 }
        }),
        pageBreak()
      ]
    },
    { properties: { page: pageProps }, footers: { default: makeFooter("Chapter One") }, children: [...ch1, pageBreak()] },
    { properties: { page: pageProps }, footers: { default: makeFooter("Chapter Two") }, children: [...ch2, pageBreak()] },
    { properties: { page: pageProps }, footers: { default: makeFooter("Chapter Three") }, children: [...ch3, pageBreak()] },
    { properties: { page: pageProps }, footers: { default: makeFooter("Chapter Four") }, children: [...ch4, pageBreak()] },
    { properties: { page: pageProps }, footers: { default: makeFooter("Chapter Five") }, children: ch5 }
  ]
});

Packer.toBuffer(bookDoc).then(buf => {
  fs.writeFileSync(__dirname + "/ZeroToHero_RadioOperator_Book.docx", buf);
  console.log("Book done.");
});
