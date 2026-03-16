const {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, LevelFormat, BorderStyle, PageNumber,
  Footer, PageBreak
} = require('docx');
const fs = require('fs');

const NAVY = "1F3C6E";
const BLUE = "4A90D9";
const GRAY = "666666";

function pageBreak() { return new Paragraph({ children: [new PageBreak()] }); }

function coverTitle(text, size) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, bold: true, size, font: "Georgia", color: NAVY })],
    spacing: { before: 0, after: 120 }
  });
}

function coverSub(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, size: 22, font: "Georgia", color: GRAY, italic: true })],
    spacing: { before: 0, after: 240 }
  });
}

function sectionBanner(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, bold: true, size: 40, font: "Georgia", color: NAVY })],
    spacing: { before: 0, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 6 } }
  });
}

function sectionNote(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, size: 20, font: "Arial", color: GRAY, italic: true })],
    spacing: { before: 120, after: 480 }
  });
}

function h(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 28, font: "Georgia", color: NAVY })],
    spacing: { before: 400, after: 140 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: BLUE, space: 4 } }
  });
}

// Evan's words - plain
function body(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: "Georgia", color: "111111" })],
    spacing: { before: 0, after: 200 }
  });
}

// AI-added - yellow highlight
function bodyAI(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: "Georgia", color: "111111", highlight: "yellow" })],
    spacing: { before: 0, after: 200 }
  });
}

// Mixed - array of [text, isAI] pairs
function bodyMixed(segments) {
  return new Paragraph({
    children: segments.map(([text, isAI]) => new TextRun({
      text, size: 22, font: "Georgia", color: "111111",
      highlight: isAI ? "yellow" : undefined
    })),
    spacing: { before: 0, after: 200 }
  });
}

function cue(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, font: "Arial", italic: true, color: "888888" })],
    spacing: { before: 60, after: 60 },
    indent: { left: 720 }
  });
}

function divider() {
  return new Paragraph({
    children: [new TextRun("")],
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 4 } },
    spacing: { before: 280, after: 280 }
  });
}

function endMark(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text, size: 20, font: "Arial", color: "AAAAAA", italic: true })],
    spacing: { before: 320, after: 0 }
  });
}

function legendNote() {
  return new Paragraph({
    children: [
      new TextRun({ text: "Highlighting key:  plain text = your words     ", size: 18, font: "Arial", color: GRAY, italic: true }),
      new TextRun({ text: "yellow = AI-added prose", size: 18, font: "Arial", italic: true, highlight: "yellow" }),
    ],
    spacing: { before: 0, after: 360 }
  });
}

const numbering = {
  config: [{
    reference: "bullets",
    levels: [
      { level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      { level: 1, format: LevelFormat.BULLET, text: "\u25E6", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 1200, hanging: 360 } } } }
    ]
  }]
};

function bullet(text, level) {
  return new Paragraph({
    numbering: { reference: "bullets", level: level || 0 },
    children: [new TextRun({ text, size: 22, font: "Arial" })],
    spacing: { before: 60, after: 60 }
  });
}

function makeFooter(label) {
  return new Footer({
    children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: "Radio Made Easy  |  " + label + "  |  Page ", size: 18, color: "999999", font: "Arial" }),
        new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "999999", font: "Arial" })
      ]
    })]
  });
}

const pageProps = {
  size: { width: 12240, height: 15840 },
  margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
};

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 1: ORIGINAL TRANSCRIPT - all Evan's words, no highlighting
// ═════════════════════════════════════════════════════════════════════════════

const originalContent = [
  sectionBanner("Original Transcript"),
  sectionNote("Cleaned and punctuated from verbal transcription  \u00B7  All your words"),

  h("The Origin Story"),
  body("About fifteen years ago, I was sitting in my cubicle at my corporate IT job, across from one of my coworkers who was going on vacation. I struck up a conversation with him and asked him where he was headed. You know, like you do. He said he was headed to Texas to pick up radio gear from a friend he had met over the radio as a radio operator. We were in North Carolina. I was doing the mental math. It was the first I had ever heard, beyond movies and pop culture references, of just how far you could talk on a radio. And I could not undo knowing that."),
  body("I am the kind of person that, once I know what is possible, I want to understand it. My office mate could not have been less excited to have told me this. He quickly regretted ever mentioning it, because he was looking to drift off into retirement without any young whippersnapper asking him questions about his hobby. We were both working at a large bank. If you are in IT in Charlotte, there is a saying: you have to do your time at a bank, much like doing your time in prison. That is the setup. And my coworker was almost done serving out his sentence. So it is completely understandable that he was not looking for a new friend to mentor. He wanted to gracefully sail off into retirement. I get it."),

  h("Finding It on the Internet"),
  body("So, like any other millennial who could not find a real-life mentor to guide them, where do you think I took to learn about radio? That is right. I turned to the internet. And the internet was a different place back then. It was less helpful than it is now, but it was still a treasure trove of information, that is for sure. And if you have ever tried to learn something on the internet, you will relate to what I discovered: about half the information was just plain wrong. Misinformed, ignorant, or just wrong. This might even be growing now, as a lot of content is built on repetitions of things that were already wrong. But you get the idea. It was either really poorly explained, confusing, or intimidating. But every once in a while, you would come across something that helped you, gave you the will to live, and you would keep on trudging through."),

  h("First Contact"),
  body("After some time, I managed to order a radio, some antennas, got it programmed through CHIRP, and I remember turning it on to one of the local repeaters and being completely and totally fascinated that this little walkie-talkie-sized thing was picking up conversations between people counties apart, right outside my dining room. My first real contact would come a few months later with the now-deceased Oscar Norris, W4OXH, on the W4CQ repeater. Oscar was a true pillar of the W4CQ repeater community, and I am glad I got to know him. Once I experienced all of that, I was pretty enthralled. I went down the path to get my amateur radio license, made some contacts, and I did not make it my whole personality. I moved on."),

  h("The Gun Training World"),
  body("From there I focused on firearms training. I went to Tennessee, to a place called Tactical Response, and started taking firearms and medical training there. I got plugged into that alumni community. Word got out that I knew how to make radios work. And the thing about gun guys who train is they see the value in radio. The fighting triad is this: shoot, move, communicate. But they generally cannot get their radios to work. So when they came across someone like me, they used my skill set to help them. I became known as one of the guys who knew how to make radios work."),

  h("The First Class and What It Taught Me"),
  body("After a period of time, some of those guys asked me to actually teach them about radio, instead of just doing it for them. So, like any good IT professional, I put together a 413-slide PowerPoint presentation with every technical detail you could ever want to know about radio. I put a room full of hopeful, eager students to sleep very quickly."),
  body("But that was where this all started. I realized in that class that if I wanted to do this successfully, it was going to have to be approached very differently. What we have today is about eighty evolutions later of what that class should have been, and has become. And what I love about this class is that it is exactly what I wish I could have found before I knew anything. If I could have taken a class like this, it would have saved me a tremendous amount of time."),

  h("Gratitude and Acknowledgment"),
  body("So I appreciate you being here. I hope you are looking forward to learning. I look forward to getting to know all of you. I want to acknowledge our hosts and thank them for hosting this class. I am very grateful for the classroom and all they have done to make this possible."),
  body("We have a lot of fun ahead of us and a lot of learning. I want to make it clear to you that I am honored you have chosen to be here this weekend. I understand what it is like to go to a training class, because I do a lot of it. I know it is a massive investment and a big sacrifice. We all have the same amount of time, and you are using yours to be here. That means a lot to me."),
  body("I will not take that for granted. I will not try to fill the time with empty space. I will not waste your time. We all have the same amount of time, and unlike your financial investment, you cannot get your time back. You will feel very happy with the return on investment for your time here. That is my goal. Being away from your family, your friends, the other things you could be doing, that combined with your financial investment to be here, I know that is significant, and I appreciate it. There is nothing more frustrating to me, when it comes to training, than going to a class where I do not feel that is respected by the instructor. So I think you will be very happy with that. We have more in the curriculum than we will actually be able to cover, precisely so that there will not be a minute wasted."),

  h("Housekeeping: Introductions"),
  body("I will warn you that we will be introducing ourselves in a moment. I am giving you a cheat sheet with the information I need you to share when you speak. So for the introverts in the room, go ahead and get your Wheaties, get ready. You are going to have to talk in front of people. But I will give you that short guide to keep it simple."),

  h("Housekeeping: Medical Plan"),
  body("A few logistical things before we introduce ourselves. Number one: you will notice there is a medical plan. The medical plan is something that might surprise you, because you thought this was a radio class and why would you need a medical plan? Well, we like to be prepared. We do not expect any problems. We do not have any problems planned. But problems sometimes happen, right?"),
  body("Does anyone in the group have any medical training? Who thinks they have the most medical training? Okay. What is your name, sir? [Student responds.] [Name] is in charge of all medical emergencies. If we are having a medical emergency, please get near [Name] or me. You will also notice I have this big red bag next to the door. You are going to want to get near that bag. It has the stuff in it that we need to keep you alive until the professionals can get to you, or we can get you to the professionals. Keep that in mind."),
  body("Two things to make clear: number one, I have no surprises planned. So if something weird is happening, it is real. I do not have any simulated emergencies as part of class. That is not what this class is for. Please take it seriously if something is going on. Number two: if you have a medical condition I should know about before an emergency, such as a blood thinner that could become an issue, or anything else, please let me know at a break. Not during the emergency, but at a break."),

  h("Housekeeping: Breaks, Lunch and Schedule"),
  body("We will be taking breaks frequently. I will give you a time that I am going to resume teaching, and that is when we are going to start back. I expect you in your seat and ready to learn at that time. If you are not in your seat at that time, I am still going to start teaching. I trust you with your own time management. Do not expect me to wait."),
  body("We will stop for lunch around noon. We have chili and cornbread today, and cold-cut sandwiches tomorrow. If those do not work for you, you are welcome to do your own thing, but that is what we are providing. We like to keep lunch short and conversational, which is part of why we provide it, so we can pack as much content into the weekend as possible."),
  body("We will conclude both days between 5:00 and 6:00. Today is easier to wrap up on time, but tomorrow please bring your most flexible self. We may need to extend depending on how long the final scenario takes. Your teams will be counting on you to be present. Please stay until the end. The final scenario is what brings everything you have learned together."),
  body("If for any reason you need to leave early either day, please make sure you let me know so I do not wonder what happened to you, especially if we are about to do a scenario or exercise. If you do not stay for the whole class, you do not receive a certificate of completion. If that matters to you, for your resume or LinkedIn profile, make sure you stick around for the full thing."),
  body("As far as start time tomorrow: we will probably start at 9:00 a.m. sharp. That means start at 9:00, not arrive at 9:00. But if today runs a little slower than I would like, we may start earlier tomorrow. We will decide together at the end of the day."),

  h("Student Introductions"),
  body("Any questions about logistics before we get to introductions? Alright. Let us start over here. Please give me your name, where you are from, and your background with radio. If that is zero experience, that is just fine. Two important things: number one, what are you looking to get out of this class? If you have something specific in mind, this is a great time to let me know, or catch me at a break. Number two: how did you hear about this class? That helps me understand what is working."),
  body("If you notice in your manual, there are empty lines on a page. Those are for you to write down everyone\u2019s name. That is going to be important for this class. Please talk loudly enough so everyone can document your name. Let us kick it off over here."),

  divider(),
  endMark("[ End of Original Transcript ]")
];

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 2: IMPROVED DELIVERY VERSION - with highlighting
// ═════════════════════════════════════════════════════════════════════════════

const improvedContent = [
  sectionBanner("Improved Delivery Version"),
  sectionNote("Refined for verbal delivery  \u00B7  Gray italics = delivery cues"),
  legendNote(),

  h("The Story"),
  body("About fifteen years ago I was sitting in my cubicle at my corporate IT job across from a coworker who mentioned he was heading to Texas on vacation to pick up radio gear from a friend he had met on the radio. We were in North Carolina. I was doing the mental math."),
  cue("Pause. Let them do the math too."),
  body("It was the first time I had heard, beyond movies and pop culture, of just how far you could talk on a radio. You cannot unring that bell."),

  bodyMixed([
    ["I am the kind of person that once I know something is possible, I have to understand it. My coworker, for his part, gave off a pretty clear vibe that he was not interested in discussing it further. I got the message quickly and backed off. Surface level acknowledgment, end of conversation. ", false],
    ["We were both working at a large bank. ", false],
    ["If you are in IT in Charlotte, there is a saying: you have to do your time at a bank, much like doing your time in prison. He was almost done serving out his sentence and he wanted to sail off into retirement in peace. I let him.", false],
  ]),

  bodyMixed([
    ["Honestly, looking back, I think I may have misread him. He might have helped me more than I assumed. But that is where I left it, and it meant I was on my own.", false],
  ]),

  body("So, like any millennial without a real-life mentor, where do you think I went? The internet. And if you have ever tried to learn something on the internet, you will relate: about half the information was just plain wrong. But every once in a while you found something that helped, and you kept trudging."),

  body("Eventually I ordered a radio, got some antennas, programmed it through CHIRP, and turned it on to a local repeater. I was standing in my dining room and this little walkie-talkie-sized thing was picking up conversations between people counties apart. I stood there and just listened."),
  cue("This is the moment. Do not rush past it."),

  bodyMixed([
    ["My first real contact came a few months later with Oscar Norris, W4OXH, on the W4CQ repeater. I had been listening for a while before I worked up the nerve to transmit. When I finally did, Oscar came back to me and told me he could not hear me well. His advice: hold the radio still and speak clearly into it. Simple as that sounds, it worked. He gave me a signal report and we had a brief conversation. I was in Iron Station, he was in a nursing home in Gastonia, and I was elated. ", false],
    ["What I did not know until later was that Oscar was blind, and that repeater was essentially his social world. He talked on it most of the day. ", false],
    ["He passed away a few years later. I am glad he was the one who answered.", true],
  ]),

  bodyMixed([
    ["I eventually got my amateur radio license, made some contacts, and moved on. Did not make it my whole personality. From there I got into firearms and medical training at a school called Tactical Response in Tennessee. ", false],
    ["That experience changed how I think about teaching. Their Fighting Pistol course is one of the best-designed pieces of curriculum I have ever seen, and the philosophy behind it stuck with me: stop optimizing for internet approval, start building real competence in real people. That is what I am trying to do here.", false],
  ]),

  bodyMixed([
    ["One concept from that world that applies directly to radio is the distinction between allowed and able. ", false],
    ["In firearms training there are instructors consumed by what the law permits in which jurisdiction. That knowledge matters. But the more important question is what you are actually able to do when a situation demands it. Radio has exactly the same dynamic. The amateur radio world has no shortage of rule-focused voices. Licensing, band plans, proper procedure. Fine. But allowed and able are not the same thing, and this class is primarily about the second one. ", true],
    ["My goal is to send you home able, because able is what lets you prevail when it matters most.", false],
  ]),

  bodyMixed([
    ["I got plugged into that training community, and word got out that I was one of the people who knew how to make radios work. Gun guys understand the fighting triad: shoot, move, communicate. They see the value of radio. They just cannot seem to get their radios to work. So I became one of the people they called. And eventually some of them asked me to actually teach them instead of just doing it for them.", false],
  ]),

  bodyMixed([
    ["So, like any good IT professional, I put together a 413-slide PowerPoint with every technical detail you could ever want. The students found it useful. But I knew I had not built what I set out to build. ", false],
    ["I had handed them a wall when they needed a ramp.", true],
  ]),
  cue("Let the laugh happen."),

  bodyMixed([
    ["That gap between what I intended and what I produced sent me back to the drawing board. ", true],
    ["What you are sitting in today is about eighty evolutions later. And what I love about this class is that it is exactly what I wish I could have found before I knew anything. If I could have taken a class like this, it would have saved me years.", false],
  ]),

  divider(),

  h("Why You Being Here Matters"),
  body("I want to be straight with you before we dive in. I am genuinely honored you chose to be here this weekend. I do a lot of training myself, and I know what it costs. We all have the same amount of time, and unlike money, you cannot get it back. You have chosen to use yours here. That means something to me."),

  bodyMixed([
    ["There is nothing more frustrating in a training environment than an instructor who does not respect that. You will not experience that here. ", true],
    ["We have more in the curriculum than we can cover, by design, so there is not a wasted minute.", false],
  ]),

  body("I also want to thank our hosts for making this space available. We appreciate everything they have done to set us up for a great weekend."),

  divider(),

  h("Housekeeping"),
  cue("Shift tone here. Sharp and efficient. They will follow your energy."),
  bodyAI("Alright. Let me get through the logistics so we can get into it."),
  body("We will do introductions in a moment. You have a cheat sheet in front of you with exactly what to say. For the introverts in the room: get your Wheaties. You are talking in front of people. The guide keeps it short."),
  body("Medical plan. You will notice it on your materials. We do not expect problems, but problems happen. Who in the room has the most medical training? [Pause for response.] Great. [Name] is in charge of all medical emergencies. Get near [Name] or me, and get near that red bag by the door. Two rules: I have no simulated emergencies planned, so if something is happening it is real. And if you have a medical condition I should know about, tell me at a break, not during the emergency."),
  body("Breaks: I will give you a return time. Be in your seat at that time. If you are not, I will start anyway. I trust your time management. Lunch is around noon. Chili and cornbread today, cold cuts tomorrow. We keep it short on purpose."),
  body("We wrap up between five and six both days. Tomorrow may run longer depending on the final scenario. That is out of my control. Please stay. Your team will need you, and the scenario is what pulls the whole weekend together. No full attendance, no certificate. If you need to leave early for any reason, just let me know."),
  body("Tomorrow: nine o\u2019clock sharp means we start at nine, not arrive at nine."),
  body("Questions on any of that? Good. Let\u2019s go. Starting right over here: name, where you\u2019re from, your background with radio, what you want to get out of this class, and how you heard about us. Blank lines in your manual are for everyone\u2019s names. Speak up so the room can hear you."),
  cue("Make eye contact with the first student. Hand it to them."),

  divider(),
  endMark("[ End of Improved Delivery Version ]")
];

// ═════════════════════════════════════════════════════════════════════════════
// SECTION 3: BULLET DELIVERY GUIDE - mostly your words, minimal annotation
// ═════════════════════════════════════════════════════════════════════════════

const bulletContent = [
  sectionBanner("Delivery Guide"),
  sectionNote("Bullet point outline  \u00B7  You know the content. Let this keep you on track."),

  h("The Origin Story"),
  bullet("Cubicle scene: coworker heading to Texas to pick up radio gear"),
  bullet("First time you truly understood how far radio could reach", 1),
  bullet("You cannot unring that bell", 1),
  bullet("Coworker gave off no-interest vibe: backed off almost immediately"),
  bullet("Bank IT joke: doing your time. He was almost out."),
  bullet("Looked back: may have misread him. Left it there. On your own."),

  h("The Internet Chapter"),
  bullet("Millennial without a mentor: turned to the internet"),
  bullet("Half the information was wrong: poorly explained, intimidating"),
  bullet("Every once in a while something helped. Keep trudging."),

  h("First Contact"),
  bullet("Ordered radio + antennas → CHIRP → local repeater"),
  bullet("Walkie-talkie picking up conversations counties apart, right outside dining room"),
  bullet("First contact: Oscar Norris W4OXH on W4CQ. Braved the transmission."),
  bullet("Oscar: hold it still, speak clearly. It worked. Signal report.", 1),
  bullet("Iron Station to Gastonia. Elated.", 1),
  bullet("Learned later: Oscar was blind, in a nursing home, repeater was his social world", 1),
  bullet("Got amateur license → made contacts → didn\u2019t make it my whole personality → moved on"),

  h("Tactical Response and What It Taught Me"),
  bullet("Firearms + medical training: Tactical Response, Tennessee"),
  bullet("Fighting Pistol: one of the best-designed curricula you\u2019ve encountered"),
  bullet("Philosophy: real competence for real people, not internet approval"),
  bullet("Allowed vs. able: not the same thing. This class is about able."),
  bullet("Prevail when it matters most"),
  bullet("Became one of the radio guys in that community: not the only one"),
  bullet("Asked to teach → said yes"),

  h("The 413-Slide PowerPoint"),
  bullet("Students found it useful. But it wasn\u2019t what you set out to build."),
  bullet("Handed them a wall when they needed a ramp"),
  bullet("Sent you back to the drawing board. About 80 evolutions later: this class."),
  bullet("This is what you wish had existed when you started."),

  h("Why You Being Here Matters"),
  bullet("Honored. Not just polite."),
  bullet("Same amount of time. You cannot get it back."),
  bullet("Financial investment + time away from family: I see it. Will not waste it."),
  bullet("More curriculum than time: nothing wasted."),
  bullet("Thank the hosts."),

  h("Housekeeping"),
  bullet("Introductions in a moment. Cheat sheet. Introverts: get your Wheaties."),
  bullet("Medical plan: designate the most trained person in the room"),
  bullet("Red bag by the door. No simulated emergencies. Tell me about conditions at a break."),
  bullet("Breaks: return time given. In seat or I start without you."),
  bullet("Lunch ~noon: chili + cornbread today, cold cuts tomorrow. Short on purpose."),
  bullet("Wrap up 5:00 to 6:00. Tomorrow may run long for final scenario."),
  bullet("No early departure without telling me. No full attendance = no certificate."),
  bullet("Tomorrow: 9:00 AM means start, not arrive."),

  h("Introductions"),
  bullet("Name / where from / radio background (zero = fine)"),
  bullet("What do you want to get out of this class?"),
  bullet("How did you hear about us?"),
  bullet("Write down everyone\u2019s name in your manual. Speak up."),

  divider(),
  endMark("[ End of Delivery Guide ]")
];

// ═════════════════════════════════════════════════════════════════════════════
// ASSEMBLE
// ═════════════════════════════════════════════════════════════════════════════

const speechDoc = new Document({
  numbering,
  styles: {
    default: { document: { run: { font: "Georgia", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Georgia", color: NAVY },
        paragraph: { spacing: { before: 400, after: 140 }, outlineLevel: 0 } }
    ]
  },
  sections: [
    {
      properties: { page: pageProps },
      footers: { default: makeFooter("Introductory Speech") },
      children: [
        new Paragraph({ children: [new TextRun("")], spacing: { before: 1800, after: 0 } }),
        coverTitle("Radio Made Easy", 56),
        coverTitle("Introductory Speech", 36),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: "Zero to Hero Radio Operator Course", size: 24, font: "Georgia", color: GRAY, italic: true })],
          spacing: { before: 0, after: 1200 }
        }),
        coverSub("Original Transcript  \u00B7  Improved Version  \u00B7  Delivery Guide"),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Plain text = your words     ", size: 18, font: "Arial", color: GRAY, italic: true }),
            new TextRun({ text: "Yellow = AI-added prose", size: 18, font: "Arial", italic: true, highlight: "yellow" })
          ],
          spacing: { before: 0, after: 80 }
        }),
        pageBreak()
      ]
    },
    { properties: { page: pageProps }, footers: { default: makeFooter("Original Transcript") }, children: [...originalContent, pageBreak()] },
    { properties: { page: pageProps }, footers: { default: makeFooter("Improved Version") }, children: [...improvedContent, pageBreak()] },
    { properties: { page: pageProps }, footers: { default: makeFooter("Delivery Guide") }, children: bulletContent }
  ]
});

Packer.toBuffer(speechDoc).then(buf => {
  fs.writeFileSync(__dirname + "/RME_Introductory_Speech.docx", buf);
  console.log("Speech done.");
});
