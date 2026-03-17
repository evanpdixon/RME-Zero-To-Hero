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

// Section heading within a chapter (not a new chapter)
function sectionHead(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 28, font: "Georgia", color: NAVY })],
    spacing: { before: 480, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 3, color: BLUE, space: 4 } }
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

const ch6 = [
  chapterHead("Chapter Six: Why Radio"),
  legendNote(),

  body("You probably understand this, just observing that you are here, that communication is an absolutely critical aspect of life. It underpins everything we do. It allows us to scale beyond the distance of our voice when we add systems to it. But communication, even within voice range, can be a challenge in certain circumstances or environments. If you are in a loud environment, a stressful environment, an emergency. If you have ever been in a high-stress situation, you have probably noticed that communication is one of the first things to fall apart."),

  bodyAI("It is a cliche even in relationships. When marriages fail or partnerships dissolve, the reason cited most often is the same: we could not communicate. Radio does not fix that particular problem. But the broader observation holds. Communication is so fundamental that when it breaks down, everything downstream of it breaks with it."),

  body("Another aspect of communication is that the systems we use to do it are pretty fragile. The world has given me lots of examples of this recently. I do not really have to explain it because we get a new example on the news every day. When we are not in times like this, people get a little bit too comfortable and they do not have an awareness of it."),

  body("Anyone ever played the game Jenga? You stack the blocks up. What do you do in Jenga? You pull a block out. With what intention? You want to get as close to total destruction as possible without causing total destruction. You want the next guy to knock the tower down. Well, I used to work at Wells Fargo. I have worked in technology infrastructure for decades. Anybody who has worked on any kind of system will agree with this: stuff is always falling apart. It is a law of nature that things just fall apart."),

  body("Now, as an end user, you are blissfully unaware of this. If things are going right, we have redundancies, we have backups, and we help you feel very warm and fuzzy about that app on your phone or your Facebook account or your Gmail account or your power working at your house or the plumbing working when you flush the toilet. All those systems that have tons of complexity and are always breaking, you are blissfully unaware of the game of Jenga that is happening. The reason you are unaware is there is a whole army of people that are fixing that stuff all day every day. Someone runs into a telephone pole, they get a call at two in the morning, and they go fix it. You do not even know. But the people involved, they very much know. Their whole life is making sure you never know."),

  body("What happens, and what we get to see in recent times, is that the Jenga tower is not in balance anymore. The outages and the problems are starting to be more visible. My phone that I thought was always going to work did not work for fourteen hours. Or a week, depending on what place you have been in the last couple of years."),

  bodyMixed([
    ["Under stress, even when the systems work, the quality of the communication degrades. ", false],
    ["There is a phenomenon called auditory exclusion. Under the effects of adrenaline, some people's ears just stop listening. Your ears still work. Your brain just says we do not need that right now. Some people get visual tunnel vision. Their visual information goes downhill and they get very focused on one thing. ", true],
    ["I have heard of people yelling at someone in a stressful situation and not being heard because that person has auditory exclusion.", false],
  ]),

  bodyMixed([
    ["On top of that, at a big scale, what happens to the quality of information during an emergency, say on your Facebook feed? ", false],
    ["Is that high quality information? Is it even from people that know anything? ", false],
    ["I watched it during Hurricane Helene. I-40 is shut down in Statesville, we cannot go any further west than Statesville. I physically drove on it for 200 more miles from there after people were saying that. Facebook truth and real-life truth are not the same thing. ", false],
    ["Are those people up to no good? Some of them, if you give them the benefit of the doubt, they think they are being helpful. They think they are warning you of something important. But is it correct? Is it from the source, or is it second, third, fourth, fifth-hand information that has been degraded like a miserable game of telephone in the third grade?", false],
  ]),

  bodyAI("All of this falls apart. And if the direction is not obvious by now: radio is a powerful way to address some of these vulnerabilities."),

  divider(),

  sectionHead("What Radio Does Well"),

  body("This is everything I can think of that radio does well."),

  body("It covers a distance further than your voice can go. That is sometimes really important. Even if I could get my voice to work in a given moment, it cannot travel that far. Is it appropriate to speak that loud? Maybe not."),

  body("It can go through barriers. Even if you are not that far away but you are on the other side of a block wall, I can talk through that. Otherwise, I cannot."),

  body("Versatility. I can talk to one person. I can talk to an army of people. Or I can gather information from an army of people and share it with all other members of the army, many to many, all at one time. That right there is unique to radio. Without other systems, how can you do many-to-many information sharing? You are going to go door to door with your notepad, collect information, create a report, and then distribute that report to all people. It is going to take hours. You could do that with a radio for a hundred people in thirty minutes. It will take you days on foot with a notepad, and it is going to be days old when it gets there."),

  body("Simplicity. This is why so many people use radios in high-stress environments. What do you have to do to make it work once it is set up? Mash the button and talk. I do not have to do Face ID. I do not have to remember your phone number. I do not have to look you up in my contacts. I do not have to remember how to trigger Siri. I just mash the button. They are not easy to set up, and that is why this book exists. But once they are set up, it is easy."),

  body("They are instant. You cannot miss a call. If it is on, it is on the right channel, the volume is up, you cannot ignore me. I am in your ear. You cannot get rid of me. There is no delay. I am not waiting on you to read the message. I am not waiting on you to answer your ring. I am in your ear right now. Very valuable."),

  body("It is portable. Anyone ever had to go take equipment to set up an entire network off grid? You need crates full of stuff and power for all that stuff. It is a nightmare. It can be done, but it is not portable. With a radio in a backpack, I can carry around enough stuff to equip thirty people with instant communication, all in one little box."),

  body("Power. Radios, at least handheld radios, come with their own power. I do not have to bring a generator. I do not have to bring a big EcoFlow solar generator. I do not have to have a car. It just has its own power. And if I need to get it power, most of it runs on twelve volt, which I can find everywhere. Every vehicle, every motorcycle, every lawnmower. They all have a twelve volt battery. Have some alligator clamps, you have got power."),

  body("Independence. Here is one of my favorites because I am an American. I do not have to depend on anybody else. Now, you might think you control your stuff because you log into it and you do the stuff on it and it is within your supervision, but do you have control of much of anything in your life? It is served up to you usually for free. That does not make any sense. It is very expensive to deliver the things to you that are free. The trade is we get to sell you stuff while you are using it, or we get to mine your data, or we get to control what you say on it. That is not that way with radio. You are fully in control. Radio to radio, all you need to be working are the laws of physics. Which so far, pretty reliable. I cannot guarantee them, but we have been batting a thousand for a while with physics."),

  body("Reliability. Because it is independent, I do not really have to worry about stuff breaking or falling apart. If I want to replace it, it is as easy as just grab another one. I do not have to get a new SIM card. I do not need to load a new firmware. I do not need to do a Windows update. It is just a radio."),

  body("Redundancy. Who carries a spare duplicate of their cell phone randomly in the box, untouched, in case you drop and break yours or it gets stolen? Probably not. Most of us have one cell phone. Why? It is expensive. It is twelve hundred dollars for a new phone these days. Single point of failure. You are keenly aware of that the moment it breaks. But I can have a backpack full of radios for next to nothing, a fraction of the cost of one cell phone. I can have what I call a bucket of Baofengs. Thirty Baofengs for six hundred dollars. Thirty. You cannot afford thirty phones. I do not care who you are. Any American can afford thirty Baofengs. And what you can do with thirty Baofengs is incredible."),

  bodyMixed([
    ["I am not here to evangelize the Baofeng radio. We use it for what it is, and I will explain a lot more about that. ", false],
    ["But the ability to afford redundancy is a significant advantage. ", true],
    ["If I break this one, I swap it out with a brand new one. I am not stressed. It cost me eighteen dollars to swap it out. I can carry on. You know when you drop your phone and it is face down, that moment where you kind of pray for the first time in the last year? You do not have to worry about that with radios. If it is broken, get a new one.", false],
  ]),

  body("Durability. What are our phones made out of? Metal and glass. Mostly glass. It is almost like they are trolling us. Here, we are going to give you this thing that your life depends on. We are going to encase it in glass. Good luck. What do we do with the phone to prevent that? We put a case on it that robs it of all its elegance and usability. Radios, if you get certain ones, they are waterproof. They are droppable. You can use them as a weapon, even. And if you break it, replace it."),

  body("Ownership. I own it. I control it. Nobody can turn it off. Nobody can stop it. Nobody can take it from me. Do you know how easy it is to turn off your phone? It is a line in a database that is currently set to true that is set to false with one command from a keyboard. Nobody has to do any kind of physical work. It is just a line in a database that changes. Why would it change? You do not pay your phone bill. That is the number one reason. Well, nobody can turn your radio off because you did not pay your bill."),

  bodyMixed([
    ["I am a big fan of owning things, but we are owning less and less every day as a culture. We do not control anything. ", false],
    ["The more uncomfortable possibility, which I am not going to say is imminent but it is possible, is that you say the wrong thing. ", false],
    ["We have seen this in various capacities in recent history where someone says the wrong thing, they no longer have a YouTube account. They say the wrong thing, they cannot be on Twitter anymore. Even the President of the United States can have his Twitter taken away. I am not making a claim about that president as much as just that fact: a commonly available communication method was taken from a very powerful person, and you are not that powerful. So what is going to happen to you? It cannot happen with a radio. It is not a line in the database that somebody can just flip off. You own it. You control it.", false],
  ]),

  body("Security. A lot of people are concerned about this. They want encryption. They want a way to conceal or obscure the information in their communication. I think that is a basic human right, to have some privacy. We are given that right as citizens in the Constitution to some level of privacy. Radios give us that ability when other technology really does not. If you send an email, who has access to that email? You, the person you sent it to, the server it sits on, everything it went through to get there, and then anyone that can access any of those accounts that is not actually that person. With a radio, I can personally encrypt it with my own keys that only I have, that I made offline, that nobody knows, and they are not stored anywhere except in my head."),

  bodyMixed([
    ["Is it perfect? Is it impenetrable to the NSA? No. ", false],
    ["But to Billy Bob down the street that wants to steal your chainsaw when you are not home so he can get another eight ball this weekend, we can encrypt against him. Or if I am running a security operation and I do not want the local pickpockets to know where my people are set up watching, I can encrypt my traffic. That is something radio makes accessible to us.", false],
  ]),

  divider(),

  sectionHead("Where It Fits in Real Life"),

  bodyMixed([
    ["If you are a preparedness-minded person, you have probably heard of PACE planning: primary, alternate, contingency, emergency. ", false],
    ["It is a layered strategy to having systems that work. You have one thing, a backup, and two more layers under it. ", true],
    ["Radio fits in there. Sometimes it is the primary. Sometimes it is at the end of the road. Even as the radio guy, I have radio low in that list a lot of days. But it is there.", false],
  ]),

  bodyAI("Without radio, when the internet is out and the phone is out, most of us have nothing. We do not have landlines anymore. We do not have pay phones. The alternative is what I call caveman comms: walking, yelling, running, smoke signals, carrier pigeon."),

  body("Farms and homesteads. Where do we typically buy land to build a homestead? Middle of nowhere. Why? Is it because you are antisocial? Maybe. But the main reason is it is cheap. Why is it cheap? There is nothing there. All these utilities you are accustomed to, like gigabit fiber internet, does the free market lay gigabit fiber in the middle of nowhere? No. It depends on a government grant. Supply and demand. There are three guys on that road. Only one of them even knows what gigabit ethernet is. They are not going to make back the half a million dollars it costs to put it in."),

  body("Teams. Every team on Earth is running on radios. Whether it is Walmart and the guy that runs the mop, because cleanup on aisle ten does not need to be broadcast over the intercom. We do not want a crowd of spectators. I can talk to him right in his earpiece. Instantly. Very valuable. Everybody from Walmart mop guy to a sniper on the SWAT team to a Navy SEAL, they all use radios on teams. You do not have to be dressed up like that to need a radio. Anybody can use it."),

  body("Vehicles. What is a convoy? It is just a fancy word for two or more vehicles traveling together. This is a game changer with radios. It completely unifies a group of cars because now I can be right in your ear immediately, and every vehicle is completely synchronized through communication. I can give directions. I can alert you of hazards. I can let you know what is going on inside my car. This is a non-negotiable feature of every vehicle I own. It has a radio in it that comes on with the car. The volume is up. It is on a certain channel. I know if I can see that car and it is on, I can talk to it."),

  body("I travel with my family a lot. I have three kids under seven and a wonderful wife that raises them for me while I teach people radio. When they go places with me, we usually take two vehicles so she is not stranded, and we travel in a convoy. What happens a lot with a bunch of kids on a road trip? A lot of bathroom breaks. On the road, it is like the three-year-old now has the power with four simple words to bring the whole operation to a screeching halt: I need to go potty. Well, when you are out west, that exit you just passed might be the last one for eighty miles. My point is radio can enhance a road trip. If you ever split up into multiple vehicles with people on a trip, this just makes it better."),

  body("Hiking, boating, mountain biking. Any of these life-endangering things we do outside, where do we go to do them? Far away from things where we cannot call 911, we cannot get help, and we certainly cannot call our buddy who might be out of sight on the trail behind us."),

  body("Trades and heavy equipment. When you are running a piece of equipment, what is one of the big problems with communication? It is loud, noisy, and vibrating. Not the greatest time to be texting or calling someone. What do you also need to be using on heavy equipment? All your limbs. An excavator requires ten levels deep of hand-eye coordination. Your visibility is limited. You are in a roll cage a lot of times. If you have a hundred-thousand-dollar thirty-ton excavator right next to you, you could run right into his bucket without realizing it. Radios give you one button to push to let him know. Total game changer."),

  body("In the trades, I supply a lot of radios to guys that are electricians. What do you do a lot as an electrician in new construction? You pull a lot of wire. You pull wire from a place far away from where you are pulling it to, and you cannot see that person. What do you really need them to do before you run out of wire on your side? Stop. If they do not stop, you start completely over because the wire you just fished through that hole is going to go into that hole and you cannot get it back. Ask me how I know. An eighteen-dollar radio can fix that. Hey, stop. Got it. Milliseconds."),

  body("Children and elderly. We decided with our kids not to feed them meth yet, and by that I mean screens. We do not give our kids iPads. That comes at a cost. I cannot communicate with my kids because they do not have devices. When they get a little older, I want to let the leash out a little. Let them go play in the woods. A radio is a cool way to do that. All my kids got radios several years ago when I really got into this. I painted them their favorite colors and programmed them just for what they needed. If you give this to a five-year-old, they appreciate the miracle that this is. They are not cynical like us. You give them something that can talk through walls, it is like you have given them a lightsaber. They are pumped, and they will take it everywhere."),

  bodyMixed([
    ["What is cool is now I can let them go do stuff beyond what I can see and have a reasonable expectation that I can stay in touch with them without having to give them a phone. ", false],
    ["A phone is not just giving them access to a bunch of stuff. It is giving everyone access to them also. Two problems I am not willing to compromise on.", false],
  ]),

  body("At the other end, with elderly folks, hopefully we come into the world in diapers and leave in diapers. At the other end, we need simple, easy-to-use ways to communicate. If you have ever been the family iPhone instructor for grandma and grandpa, you know. With a radio, if it is on, it is on the right channel, the volume is up. What do you have to do? Mash the button. Very handy way to take someone who might have dementia, might have physical impediments. If they can just mash the button, it works. Basically, I have a DIY intercom system that can work for miles."),

  expandNote("The transcript continues with a detailed section on church and school security, including the vulnerability of unencrypted carpool line radios and the value of encrypted comms for church security teams. Also includes a story about a Renaissance Festival weather alert via radio. Consider expanding here."),

  expandNote("Add the radio summary statement from class: 'Radios are a versatile communication medium' and the breakdown of each phrase: silent/invisible, multiple recipients, at distance, mechanically simple, minimal visual interruption, when other means are ineffective or unavailable."),
];

const ch9 = [
  chapterHead("Chapter Nine: Your First Radio"),
  legendNote(),

  bodyMixed([
    ["If you have ever done firearms training, you have probably heard of Clint Smith. He has a philosophy that he wants students to be students of weapons craft, not students of a particular weapon. What does that mean? If I pick up an AK-47 off the ground, I can make it work, even if what I run at home is an AR. You ought to be able to load it, unload it, make it safe, make it fire, clear basic malfunctions, because you are not guaranteed to be fighting with your gun. You might fight with somebody else's gun.", false],
  ]),

  body("I love that philosophy, and I am applying it here with radio. You are not guaranteed to be using your radio. I think it is even more likely with radio than with firearms that you will end up with something unfamiliar in your hands. Someone just handed you a radio and you have to make it work. So we are approaching this at a generalized level so that it will work for you regardless of what you are holding."),

  sectionHead("The Battery"),

  body("Your battery and your radio almost never come assembled when you get a new radio. It is a shipping regulation that the radio needs to be separate from the battery. What happens is people get real excited, take it out of the box, and start shoving stuff together. Batteries and radios go together differently depending on what you are using. Some slide in. Some fold in with a flap. Some latch. If I try to install one the way the other goes, I am going to break something. When you first get a radio, just take a second and deliberately look at how the battery goes in. Does it slide? Does it fold? Does it latch? Do not break it."),

  bodyMixed([
    ["On the bottom of the battery, there are two little holes that align with two nubs on the bottom of the radio. That is what holds the battery on. ", false],
    ["Those nubs are surprisingly fragile. If you use an extended battery, you create a long lever, and when you drop it, those nubs shear right off. ", false],
    ["With the compact battery, there is almost no chance of shearing them off. ", true],
    ["None of my kids' radios have those nubs anymore. Here is an easy way to fix a radio where those nubs are broken off: you take all the stuff off of it, hold it in your hand, find a trash can, and drop it in. Then you get a new one. That is how we fix Baofengs. We do not operate on them.", false],
  ]),

  body("Nowadays I am almost always using the small USB-C batteries. The fact that they are USB-C is a game changer, and that is one of my non-negotiables on a radio these days: it has to be USB-C chargeable."),

  sectionHead("The Antenna Connector"),

  body("If you look down the barrel of where the antenna goes on your radio, you will see a little copper wire in the middle. That is not incredibly confidence-inspiring. It is very fragile. If something were to kink or break that wire, the radio is ruined and going in the trash. If you get a pin lodged in there in your backpack and it pushes it over, you go to put your antenna on and it breaks it off. Done."),

  body("One of the things I struggled with getting into radio was identifying this connector. If you know, there is SMA female and SMA male. I have done a lot of plumbing and electrical work in my life, and when I look at the threads, I see female threads and I think I need male stuff. In radio, that is backwards. You do not worry about threads. You look at the center conductor. That determines gender on coax, on antennas, on anything. The center conductor is what matters."),

  sectionHead("The BNC Adapter"),

  body("The very first thing I do with any radio is put a BNC adapter on it. You thread it on, about seven turns, finger tight. Where is that scary little fragile wire? Totally enveloped by this adapter, never to be seen again. Totally protected. This adapter will now live on this radio. It should never come off."),

  body("We have now changed to a BNC jack, which is a different style. It is not threaded. You slide the antenna on and give it a quarter turn to lock. That is it. What happens with threads? They can cross-thread. They can wear out. They can jam. They get dirty. Threading and radios is not my favorite thing. This is one place I can eliminate that."),

  body("I put that adapter on every radio I own, no matter what gender it starts out as. It ends up being BNC female, no matter what. So what is cool is I now have one antenna type. My Yaesu, which is SMA female natively. My Baofeng, which is SMA male. They all take the same antenna. I do not have to go buy a forty-dollar antenna for my Baofeng that I cannot put on my good radio. I buy BNC antennas. They work on everything. I really love that standardization."),

  sectionHead("The Screen"),

  bodyMixed([
    ["If your radio has a screen, it shows you all the information you need to know about the radio. ", false],
    ["Some radios do not have screens. What can you infer from that? Either your boss does not trust you to interact with that radio, or it is a simpler radio with just a channel knob and nothing else. If there is no screen, you are not going to be doing any programming on it.", false],
  ]),

  sectionHead("Power and Volume"),

  body("On a Baofeng, the power is part of the volume knob. It is a physical switch. You hear that click when you turn it on. Turn it on just past the click. We do not need to crank the volume. I like to leave the voice announcements on. That is a hot take, but I think it has benefits. It announces everything about the radio. No other radio does that. I think it is cool. It is easy to turn off. So just turn it on past the click, wait a second, and then adjust from there. Nobody wants to hear Mrs. Chen announcing what mode you are in unless you need to know."),

  bodyMixed([
    ["A physical power switch is cheap to manufacture. But one cool thing about it is it actually helps not drain the battery. ", false],
    ["On a Yaesu, the power is a press-and-hold button. For that to work, current has to be running through that button all the time, and it will drain the battery dead sitting in a bag. ", false],
    ["The vulnerability of the physical switch being on the volume knob is that it is easy to get it rubbing on something. ", true],
    ["At my first Fighting Rifle class, I wore my radio on my strong side with a sling, and every time I pulled my rifle up, it would grab the volume knob. The first thing I did when I went to reload was move the radio to the other side. The exoskeletons protect that volume knob. They physically envelop it so you have to get your finger down in there to turn it on and off.", false],
  ]),

  sectionHead("Channel Selection"),

  body("Some radios have a dedicated channel knob. It is a clicky, detented knob. If you feel a clicky knob, that is channel change. If it is infinitely variable with no clicks, that is a volume knob. Why does it click? To indicate a change. If I am on channel one and I want to get to channel eight, I can feel it without looking: two, three, four, five, six, seven, eight. It can stay in the pouch. Each click indicates a change. It is expensive to manufacture. There is a little ball bearing popping into a socket at each position."),

  body("On a Baofeng, we use arrow buttons to change channels. That is cheaper to make. But anyone who has ever had to punch their zip code into a gas pump knows: buttons are not a reliable information entry system. You are going to have to really look at the radio. You are not going to change the channel with it in a pocket. Just one of the downsides."),

  sectionHead("Push to Talk"),

  body("Hold the radio in your right hand. Your index finger naturally lands on a big button on the side. That is the push to talk. It is always the big one on that side. Why do they make it big? That is the one you are going to be dealing with. It is like the skinny pedal on the right. What does that do in a car? Gas. It is always the gas. Roll with it."),

  body("It is the push to talk, not the push to think, not the push to ponder. Be ready to talk when you push it. That might mean waiting a second to gather your thoughts before you push it. If someone is transmitting, nobody else can do anything. You are clogging up that whole channel the entire time you press that button. So when you press it, you better get down to business."),

  sectionHead("Squelch"),

  body("Squelch is essentially a filter based on signal strength. Think of a fence. If I have a fence that is one foot tall, what does it keep out? Not much. But it keeps out nothingness. Your radio hears nothingness all the time, and it sounds like static. As I raise that fence, it keeps out more stuff, but at what expense: it is more difficult to get over it when you want to get over it."),

  body("If I set my fence to ten feet tall, it keeps out basically everything. But if I want my friends to get in the yard, they cannot do it very easily. Their signal strength has to be sky-high. So we are always doing this dance. If I set it to about a three or four, I do not hear things that are annoying non-transmissions, interference-type noises, but I generally hear everybody I want to hear. That is where I start."),

  body("If I start hearing noise in my radio that is not a person or a real transmission, I can raise the squelch at the expense of potentially missing stuff I want to hear. Garage door openers, stuff in the atmosphere, or something so far away that it is clearly not relevant. It is never a free lunch. Every time you raise the squelch, it is a risk that you are not going to hear the people you want to hear. I err on the side of being more liberal. Keep it lower and suck it up. But if it is the difference between keeping the radio on and turning the volume down, keep the squelch up. Turning the volume down is what I want to avoid. If you turn the volume down, I cannot get ahold of you."),

  body("The monitor button sets the squelch to zero. It fully opens the squelch. Think of pushing the fence all the way down so people can get through. You do not stand there all day holding the fence down. It is very temporary. If you hear somebody breaking up, cutting in and out, you can hold down that monitor button while you listen, and as soon as you let off, it goes back to its setting."),

  sectionHead("VFO and Memory Mode"),

  body("The VFO/MR button. Every radio is going to have something along these lines. VFO stands for variable frequency oscillator. I do not know what that is. We are not going to worry about it. M is for memory. What do you think we do in memory mode? We look at our saved stuff. The other one is manual or variable entry mode. That is where we do our programming."),

  body("Press the button. The right-hand side of the screen is where we direct our attention. Numbers appear, then they disappear. What do those numbers mean when they appear? Channel numbers. That is what is stored in that spot. When they disappear, you are in frequency mode or manual entry mode. When they appear, you are in channel mode or memory mode. I do not focus on what the button is labeled or what each mode is called. I use the context: do I see channel numbers? That means I am navigating by channels. No numbers? I can punch stuff in by hand."),

  bodyMixed([
    ["If you want to save something into memory on this radio, you have to start in frequency mode. There is no editing a memory. ", false],
    ["The radio will allow you to appear to edit it. It does not say error. It just lets you try. Over and over. Until you remember you cannot do that. Please do not try to edit memories. You have to work from frequency mode.", false],
  ]),

  body("The A/B button gives you two parking spots. They are fully independent. All your settings are independent for the A line and the B line. It is a quick change. In memory mode, I can have channel eight and channel forty-two, a primary and an alternate. Without that, I would have to press the button thirty-some times to get from eight to forty-two. The A line is the top line, and it is the only one that can write into memory. If you do a bunch of work on the B line, you cannot save it. Please work from the A line. That arrow should be pointing up."),

  sectionHead("The Microphone"),

  body("That tiny little hole above the A/B button is the microphone. That is where you need to talk into. Please do not hold it like a speakerphone. Straight up and down, right in front of your face. Your antenna needs to be vertical. The signal emanates from the antenna perpendicular. Unless the people you want to talk to are in the basement or above you, vertical is how you want it. It is forgiving in the same room, but that gives you a bad habit. Where it does not work is at the edges of its capability. So straight up and down, right in front of your face."),

  sectionHead("Keypad Lock"),

  body("The pound sign has a little key icon. Press and hold it and it locks the radio. The same icon shows up next to the battery level indicator. Your front keys are all disabled. It does not disable the side keys. You can still transmit. It does not prevent you from adjusting volume or accidentally turning off the radio. If this is going to go into a pouch or a pocket, lock the keypad. What can happen otherwise? You sit down, your pants get tighter, it presses the channel changer, and you are on a different channel. You spend four hours wondering why nobody talked to you. To unlock, press and hold again."),

  sectionHead("Scanning"),

  body("This can scan. It is not a scanner. It is going to incrementally go through either frequencies or channels one at a time until it hears activity. How does it define activity? Something has to break the squelch."),

  body("Scanning is a lot like waiting for the bus. How do you know if you are early or late for the bus? If it is not there, you do not know. The only way you know you are at the right place at the right time is if you and the bus are at the same place. Same deal with scanning. I have to be listening where the conversation happens when it happens. If I am scanning four channels at about one per second and I miss the activity, I might never hear it."),

  bodyMixed([
    ["This radio is slow at scanning. About one per second. If you put a hundred twenty-eight memories in here, it takes over two minutes to get through the whole list. ", false],
    ["If you put fewer things in the radio, it is more valuable. Four channels scanned every three or four seconds is useful. ", true],
    ["A dedicated scanner does about ten per second, but you are talking six to eight hundred dollars for a device that all it does is listen.", false],
  ]),

  sectionHead("Power Level"),

  body("To change the power level on a Baofeng, tap the pound sign. Do not hold it, just tap. You will see L appear and disappear. L stands for low power. Would we want to put underpowered ammo in our concealed carry pistol? This is already a pistol. We are not running low-power ammo in our pistol. I do not really know what the functional purpose of low power is for a handheld in real life. I am going to use all the power it has. If you see an L, get it to go away."),

  bodyMixed([
    ["Now on other radios, that is not always true. On a hundred-watt radio, you better believe I do not need to run a hundred watts all the time. ", false],
    ["If five watts does the job, it is crazy to run a hundred watts to talk to my wife in the backyard. That is a waste. It is polluting the environment with extra energy and potentially interfering with people for no reason. ", false],
    ["But for handhelds, I am running high power. The BTEC has low, medium, high, and turbo. Guess what I run all the time. Turbo.", false],
  ]),

  sectionHead("Essential Functions Checklist"),

  bodyAI("Every radio you pick up, these are the things you need to figure out before you carry it anywhere. This is the bare minimum:"),

  body("Switch between VFO and memory mode. Enter a simplex frequency. Program a repeater by hand. That is the iron sights of radio. You have to know how to use it. Are you going to use it all the time? Of course not. Is it fast? No. But it might be all you have. You have to know how to do it. Adjust the squelch. Lock and unlock the keypad. That is it. If you do not know how to do all of this, you have no business carrying it around."),

  expandNote("Consider adding a visual reference or quick-reference card format for the essential functions checklist, similar to the manual page 18 reference from class."),
];

const ch13 = [
  chapterHead("Chapter Thirteen: Communication Strategies"),
  legendNote(),

  sectionHead("Simplex"),

  bodyAI("The simplest form of radio communication is simplex: one frequency, used for both transmitting and receiving. You talk on it, you listen on it. Nothing moves. It is one lane used for both directions. Simplex is where every radio operator should start, because it strips away every variable except the ones that matter: are you on the right frequency, and can the other person hear you?"),

  expandNote("Consider expanding the simplex section with the national calling frequency (146.520) and FRS channel references from the class transcript. Also explain why simplex is limited by line of sight and power."),

  sectionHead("The Radio Net"),

  body("A net is many-to-many information sharing. If there are fifteen people, all fifteen people both participate and hear the check-ins of all other fifteen people. It is like fifteen times fifteen combinations. It would take a tremendous amount of time to do that any other way. Going door to door with a notepad, collecting information, creating a report, distributing that report. With a radio net, you accomplish it in one setting."),

  sectionHead("Running a Net"),

  body("The first thing I do is announce the net. I pause. I announce it again. I pause. I might even announce it a third time and pause again. Why am I announcing it so many times? Because some of you are always late. If we say our net is at nine o'clock, I am going to announce it at 8:59, at 9:00, at 9:01, maybe 9:02. All our clocks are not synchronized. Especially if there is an internet outage and a power outage, you may not even have your cell phone with an accurate clock on it. We want to cast a wide net for the opening."),

  sectionHead("Yielding for Emergency Traffic"),

  body("You will notice a lot of yielding and giving space for emergency or priority traffic. It is a courtesy, and you practice like you want to do it in real life. In real life, somebody might need that channel, and it is more important than your stupid little radio net. You better believe they are sick of waiting for you to be done to do something important."),

  bodyMixed([
    ["I have been sitting and waiting way too many times during disaster relief for people to talk about what they ate for breakfast and how their blood pressure is not going down because they are on the wrong statins. Meanwhile, I need to announce that there is free water at the local fire department, and can we please open up this repeater. ", false],
    ["It is ignorance and discourteousness. You do not own a frequency. It is not yours. Even if it is your repeater, you do not own where it is operating. Just like if you are flying an airplane, you might own the airplane, but you do not own the air it is flying through. You do not own the lake. You do not create wakes in the middle of the dock. Yield. Make space. Pause. Make room for other people.", false],
  ]),

  bodyMixed([
    ["Even if you did own it, somebody might have something important. ", true],
    ["Like a red status. Do you think you are going to wait your turn to give your red status if you are last? No. You are jumping in line. That is the reason we make space.", false],
  ]),

  sectionHead("Brevity Codes"),

  body("I gave the instructions using color codes: green, yellow, red. Green means I am okay. Yellow means I might need some help, let us talk about it. Red means I need help right now, urgently. Are they top secret? No. I said what they mean. So why are we using them if they are not top secret? It is a brevity code. Saves us time."),

  body("If I said give me your name and status, here is what would happen. The first two or three people would be reasonable. This is Evan, I am good to go. And then the next guy has to give a novel. This is Matt, lunch was pretty good, class is okay, it is a little hot for me but you know it is summer, I guess I am eight out of ten. Now it is a competition for everybody else to see who can be the cutest, and now our fifteen-second net is a fifteen-minute net and we are all ready to kill each other at the end of it."),

  body("I do not need the novel. I just want to know: are you okay or not? I want to do that as quickly and efficiently as possible so we can get on with doing stuff. Radio is not the point of our life. For some people, radio is the point of their life and they want to be on a net for three hours. I do not."),

  sectionHead("Do Not Say Words You Do Not Know"),

  body("If you show up at a net and this is the first time you have heard people using names and colors, and they have already started, and it is about to be your turn, and you have heard everybody use a certain color, and you are feeling a lot of peer pressure to go ahead and say that even though you have no idea what that word means: do not use that word. Do not use words you do not know what they mean. Ask. Act like a normal person. Sorry, I was not here for the intro, you mind giving the instructions again?"),

  sectionHead("The Repeat-Back and Pause"),

  body("After every check-in, I repeated it and then I paused. The pause is there to allow for a correction. I have to artificially force that pause, or there is no time for a correction. If everybody just goes one after another, and the first person's name was wrong, they are ten people in before they can get my attention. If I deal with what I got wrong right then and there, that is the right time and place for it. One one-thousand, two one-thousand. Go. Do not spend a bunch of time pausing."),

  bodyMixed([
    ["Also, while I paused for emergency traffic, I was getting my ducks in a row. Logging check-ins, getting my template up, getting my pen ready. ", false],
    ["Those pauses are not dead time. They are admin time that keeps the net running smoothly.", true],
  ]),

  sectionHead("Enforcing Discipline"),

  body("If somebody does something you did not ask them to do, nip it in the bud right off the bat. The first time somebody deviates from what you want, politely address it. Hey, I got that one, Sonia, you are green. Hey guys, from here on out, just wait for me to ask for the next check-in, I am keeping a log here. It just gives me time to jot it down."),

  body("You do not need to be a jerk. But you have to enforce anything that deviates from what you want. I know this sounds dictatorial. Here is the deal: we only have our voice. All we have is the radio. We have to make order out of a very chaotic situation. I am trying to get check-ins for fifteen people in an orderly way, and everyone is counting on the person running it to keep order. If they do not do a good job, everyone is being held hostage by the people running amok. You decide how you come across. You can be gentle. But you have to address it. Do not let it go further."),

  sectionHead("Handling Doubles"),

  body("When people are not going in a prescribed order, they are going to step on each other. Two people transmit at the same time and it sounds like robot wars. Here is what works almost every time: hey, I heard two there, doubling up, let us go one at a time please. I do not know what it is, but if you just say go one at a time, even in a room of a hundred people, only one person is brave enough to go again. And by the time they go, everyone else is like, oh thank God somebody else went. It fixes it. That is the magic pill."),

  body("If that does not work, you might have to get creative. Names that start with a certain letter, people of a certain age, people with a certain color shirt. Figure out something to divide people up. The more reluctant everybody is, the more likely it is that one person is slightly less reluctant, and it resolves itself."),

  sectionHead("The Read-Back"),

  body("At the end, I gave a read-back. A summary. That is dealer's choice depending on how important the information is. In a neighborhood net that happens when the power goes out, somebody got there late and did not hear the first three check-ins. They might want to know: is Miss Barbara okay? It would be nice to hear the list."),

  bodyMixed([
    ["If you need to pause during a long read-back, say break. ", false],
    ["Saying break is an indicator: hey, I am pausing, I am going to start back, hang on. It keeps the line open for you. Then you start back when you are ready.", false],
  ]),

  sectionHead("Closing the Net"),

  body("At the end, announce that it is over. And at the end is an essential time to inform everyone when the next net is. If there is a power outage in the neighborhood and we do this every night at nine on a certain channel, I would reiterate to everyone: it is 9:10 now, we are synchronizing clocks, we will meet again here at the same frequency tomorrow night at nine. If there is a more urgent situation, we will meet every hour at the top of the hour on the same frequency. Why are we announcing all of this? We do not have email. This might be the only source of information. They may not know it is every night. You need to remind everybody."),

  sectionHead("Why Not Call People by Name First"),

  body("I ask for check-ins. I do not call on specific people. Why? In some circumstances, it could be an impersonator. If you just say a name, it is really easy for someone to respond as that person. I am not expecting to operate in that environment. But context is king. You might not always want to give away people's names. You might want to wait for them to give it to you."),

  sectionHead("The Bidirectional Comms Check"),

  body("Just being able to hear somebody does not guarantee they can hear you. You have to do a bidirectional comms check. Unless it is life or death, if you are doing a legitimate comms check, it is two-way. Just because you can hear me does not mean I can hear you. You might be on the right channel with all the right settings, but your radio physically cannot transmit. You will not know unless you test it both ways."),

  expandNote("Add material on repeaters and cross-band repeat from the class. Also consider adding the dispersed net exercise results and what they revealed about radio coverage and dead spots."),
];

const ch10 = [
  chapterHead("Chapter Ten: Programming"),
  legendNote(),

  sectionHead("The Iron Sights of Radio"),

  body("Programming a repeater by hand is the iron sights of radio. You have to know how to do it. Are you going to use it all the time? Of course not. Is it fast? No. But it might be all you have. You have to know how to do it. This is probably the hardest thing we will cover, but you will leave here confidently knowing how. And if you can do it on a Baofeng, you can do it on any radio."),

  sectionHead("Programming a Simplex Frequency"),

  body("Start by making sure you are in frequency mode. How do you know? No channel numbers on the right side of the screen. If you see numbers, press the VFO/MR button until they disappear. Make sure you are on the A line. The arrow should be pointing up."),

  body("Type the frequency on the keypad. For example, FRS channel three is 462.6125. Your radio only goes three decimal places, so you type four-six-two-six-one-two. It will automatically add the five. That is it. You have programmed a simplex frequency. You are transmitting and receiving on the same frequency. One lane, both directions."),

  bodyMixed([
    ["The national calling frequency for ham radio is 146.520. ", true],
    ["It is the most commonly monitored frequency in all of radio. It is a really good one to keep in your mind because that is a place you can find help sometimes if you need it.", false],
  ]),

  sectionHead("The Factory Unlock"),

  body("These radios come locked from the factory. They will only transmit on amateur frequencies. To unlock them, you need to put in what amounts to a cheat code. Turn the radio off. Hold down VFO, Monitor, and Push to Talk all at the same time. While holding all three, power on the radio. Wait to see the word FACTORY on the screen. That resets the transmit restrictions and the radio can now transmit on FRS and other frequencies."),

  bodyMixed([
    ["This happened by accident the first time I did this exercise in class. ", false],
    ["Now I leave it in on purpose because it teaches an essential lesson: just being able to hear me does not mean your radio can transmit. You can be on the right channel with all the right settings, and your radio physically cannot transmit there. You will not know unless you try.", false],
  ]),

  sectionHead("Saving to Memory"),

  body("To save a frequency into memory on a Baofeng, you have to start in frequency mode. There is no editing a memory on this radio. It will allow you to appear to edit it. It does not say error. It just lets you try. Over and over. Until you remember you cannot do that. Please do not try to edit memories. You have to work from frequency mode."),

  bodyAI("The process for saving a frequency to memory varies by radio model, but the general principle is the same: configure the frequency and all its settings in frequency mode first, then write it to a memory slot. On a Baofeng, this is done through the MENU button, selecting the memory channel number, and confirming the write. The A line (top line) is the only one that can write to memory. If you do work on the B line, you cannot save it."),

  expandNote("Add detailed step-by-step for saving to memory on a Baofeng: MENU > 027 > select channel number > MENU to confirm. Also cover programming a repeater by hand (offset, CTCSS tone) and computer programming via CHIRP. Reference the chirp-tutorial-outline.md for the CHIRP section."),
];

const ch11 = [
  chapterHead("Chapter Eleven: Principles of Use"),
  legendNote(),

  sectionHead("On, On the Right Channel, Volume Up"),

  body("If the radio is on, it is on the right channel, and the volume is up, you cannot ignore me. I am in your ear. You cannot get rid of me. That is the whole point."),

  body("Do you think if your kid just broke their leg and their femur is poking out and you just put them in the car and your wife is going to follow you, do you think either of you are going to think to turn on your radio? Not right now. And guess when you are going to need it? Like that day, when they are not on. It is absolutely critical to me that it comes on with the car, that it is on the right channel, and the volume is up."),

  body("Why is the right channel so important? So they are listening where you are talking. If they are not there, I do not care if it is on. It does not help. What about the volume? You are on the right channel and it is on, but you turned the volume down because there is an annoying interference on that channel every day. You will turn it up when you need it, right? Are you going to remember to turn the volume up? Non-negotiable."),

  bodyAI("This is the mantra that runs through every deployment tier, every use case, every exercise in this book. If those three conditions are not met, nothing else matters. The radio is a paperweight."),

  sectionHead("The Bidirectional Comms Check"),

  body("Just being able to hear somebody does not guarantee they can hear you. You have to do a bidirectional comms check. Just because you can hear me does not mean I can hear you. You might be on the right channel with all the right settings, but your radio physically cannot transmit. You will not know unless you test it both ways."),

  bodyMixed([
    ["I have watched this happen with a room full of students. Everyone could hear me perfectly. Must be working. Let us run the mission. No. All you have is half the equation. ", false],
    ["Receiving does not guarantee transmitting. Always confirm both directions before you depend on the link.", true],
  ]),

  sectionHead("Practice Now, Not During Armageddon"),

  body("This is not just something we set up and operate in our basement during Armageddon. That is almost not even relevant to what we are learning here. This is something that can be useful to you every day. And I think if you have any chance of using it during Armageddon, you are going to need to implement it now in your everyday life so you have some clue what the heck it does and you are familiar with it when it matters."),

  sectionHead("Making the Radio Not Annoying"),

  body("I am going to teach you how to make sure the radio is not making noise when you do not want it to make noise. This is something nobody talks about. They can teach you how to make them work. They cannot teach you how to make them not annoying so you turn them off. You do not want to listen to squawks and chirps and nonsense going on. You want to listen to: does my wife need me or not? That is important."),

  expandNote("Expand on CTCSS/DCS tones as the primary tool for filtering unwanted traffic. Also cover channel discipline, monitoring etiquette, and the difference between scan monitoring and dedicated channel monitoring."),
];

const ch17 = [
  chapterHead("Chapter Seventeen: Gear Recommendations"),
  legendNote(),

  bodyAI("There are five tiers of radio deployment, ranging from most portable and least capable to least portable and most capable. As you move down the list, portability decreases but reliability, dependability, and capability increase. Understanding where each tier fits will help you decide what to invest in and where."),

  sectionHead("Tier 1: EDC (Everyday Carry)"),

  body("This is a handheld radio with a stubby antenna. I am the radio guy. It is my job. I do not carry a radio on my person. Everyday carry for me means it is in my bag. I have it accessible to me every day, everywhere I am, but it is not on me. Part of the reason it is not on me, just to be frank, is I do not have any room left."),

  body("How many radios are there in this equation? One. What can you do with one radio? This is my pet peeve with every bug-out bag video on YouTube where some dude dumps out his bag full of stuff he just bought at Bass Pro Shop on his comforter. It has not been washed in four years, but he is hoping you do not notice. There is always a radio. One radio, not a scratch on it. And it is assumed that radio is going to help him contact the people he needs to get in touch with when the world is falling apart. There is never any explanation about how exactly it is going to do that. That is called a good luck charm. A magic talisman. It is a paperweight for that guy."),

  bodyMixed([
    ["What is good about the EDC radio? It is small, portable, compact, has its own power, convenient. ", false],
    ["What are the downsides? There is only one, which means no redundancy. And I can really only contact people that also have radios. The stubby antenna reduces range significantly. What we do to cripple it, to make it more convenient, cripples it.", false],
  ]),

  body("There is a very popular company on the internet that has invested a lot in advertising. They show a little tiny device with an antenna smaller than a stubby that can talk thousands of miles. What does that operate on? It is a cellular radio. We already have cellular radios. My phone has eight radios in it. I do not need another one that I can get wet. What is not cool about it is that it does not work when my other cellular radio does not work. That is what they imply when they put the image of this and Hurricane Helene in the background. That really bothers me. Very personal issue for me as someone that gave hundreds of radios to people during Helene where that product would not have worked."),

  sectionHead("Tier 2: Duty / Tactical"),

  body("I can take that exact same radio. Nothing changes about the hardware. But I clip it to my belt and all my buddies do the same thing. They are programmed the same. They are on. They are on the right channel and the volume is up. It is now tactical."),

  body("We might just run Walmart. I might be a cashier. You have a mop. You are the manager. We are tactically using radio, meaning we are implementing these radios as a part of our work. It is a part of my equipment. It is on me. It is on. It is on the same channel and the volume is up. This is a total game changer for capability. What is better than me with my radio? Taking that same radio and distributing copies to all my buddies, and they are on with the volume up on the same channel. We are coordinated. We are in a system together."),

  body("That is why I built three-radio kits. The idea is me and the two people who showed up today have a system, a quick-deploy system to solve problems with. This is not something I robbed to run my farm with. This is a kit that stays in places where I might need to implement them. Because my buddies who I told to bring their radios, did they bring them? Or if they did, did they just order them on Amazon the night before? Are they programmed and ready? These are programmed, ready, and identical. They work."),

  bodyMixed([
    ["Is it multi-cam? Am I wearing a plate carrier? I might be wearing chainsaw chaps and a tow strap for my truck. That is tactical. In the sense that we are doing work with the radio. ", false],
    ["I do not care if your work involves guns and cool guy stuff. That is not what I mean when I say tactical. It is not exclusive of that, but it is not exclusively that.", false],
  ]),

  sectionHead("Tier 3: Vehicle-Mounted (Mobile)"),

  body("This is a mobile radio. In a vehicle, it would be mounted under the seat or on the dash. It has a detachable faceplate that I can locate remotely. What is required to make it work? External power. In a vehicle, it gets power from the alternator and the battery. It is designed to run on twelve-volt power. Unlike a handheld that has onboard power, mobile radios do not. You bring the power with you. That adds complexity. But with that complexity, more capability."),

  body("It also does not have an antenna. In a vehicle, I actually need my signal to get outside the metal cage, so I need it on the roof or mounted somewhere externally. A more complex solution, but what increases? Range, possibly. Features, ease of use. Big clicky knobs, big buttons, bigger screens. It is built for a vehicle environment where I need big buttons because I need to focus on driving. I do not have time to look at a tiny keypad."),

  body("One unsung hero of mobile radios: the remote microphone. I can pick it up, bring it to my mouth, and talk. Never take my eyes off what I am doing. Very big benefit when driving."),

  sectionHead("Tier 4: Man-Pack / Go-Bag"),

  body("Take that same mobile radio and put it in a self-contained portable package. It has the mobile radio installed, a handle, a battery and an antenna, all in one bag. A grab-and-go versatile radio system. I can use it as a base station, in a vehicle, hiking or camping, all in one bag."),

  body("Now, why am I saying you probably do not need one of these? I mentioned the vehicle radio is a non-negotiable. Every car I own is going to have one. Some of you are thinking: I will put it on my desk at home as a base station, then take it to work in the car. Time to go to work? Disconnect the antenna, grab the bag, hook it up in the truck. Come home, set it back up on the desk. How many times is that going to happen? About one day. And it will live where it lands for the rest of its life. I know you aspire to do more with it. You are not going to. I have never seen somebody have the discipline to move them around. I am the radio guy, and even I know I have to bolt it in if it is going to be there when I need it."),

  body("So what are the real use cases? For me, I travel a ton. I need something versatile. I am not always in my vehicle. Sometimes I rent vehicles. I am teaching classes where I need something I can hand to someone and say, go set this up in your car, we are leaving in five minutes. It has everything in the bag. It is supplemental to all the other tiers. It comes last."),

  sectionHead("Tier 5: Base Station"),

  body("Take that radio and mount it to your master closet shelf. It lives there. Set up a mast on your roof and it never moves. What is so cool about that? It is dependable. Why? Because it is always there. If it is always there, it is always got power. Am I plugging and unplugging anything? No."),

  body("If I need to keep my drinks cold at work today, do I load my refrigerator into the truck and take it with me to work every day? What would start to happen to that refrigerator? It is going to break. It is not made to be moving around all the time. A base radio is an appliance. It does a certain job. It sits there, and all it does is that job. When do you mess with your fridge? When it breaks or when you get a new one. That is it."),

  bodyMixed([
    ["Guess what likes to get involved when we plug and unplug things? Murphy. Murphy shows up. ", false],
    ["Leaving it where it is and not messing with it. Things can still go wrong. I have a client that has some goats. I installed a bunch of cool stuff for him. He called me about a year later. Radio is not working anymore up on the hill. Guess what the culprit is? Goats and coax are not friends. They had chewed through it in five places.", false],
  ]),

  body("What else is cool about the base station? If I set up a big antenna at my house, and it can reach somewhere today that I need to reach, guess what is going to happen tomorrow? It is still going to reach there. With handheld radios, you can move one foot and lose a contact fifty miles away. I promise you it is that quirky. When I mount an antenna, I have dependable, reliable performance. There are really only two things that change it. One is seasonal: leaves on the trees can cause just enough interference to miss a long-range contact. The other is the thing you are trying to reach is down. You cannot control that. We are controlling variables with a base station."),

  sectionHead("The Trade-Off"),

  body("At the bottom of the list, we have controlled the most variables. It is the most capable, most reliable, most dependable. As we go backwards up the list, reliability and dependability go down. But what goes up? Portability, convenience, size, weight. Most of these, you could do everything on this list for about a hundred dollars each. You can do all of them with a Baofeng. It will not be great, but you can fill that role."),

  expandNote("Add the firearms analogy from class: EDC radio = concealed carry pistol (.380), tactical handheld = duty pistol, mobile radio = AR-15/carbine, base station = precision rifle. Each tier trades portability for capability. Also add specific product recommendations for each tier."),
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
    { properties: { page: pageProps }, footers: { default: makeFooter("Chapter Five") }, children: [...ch5, pageBreak()] },
    { properties: { page: pageProps }, footers: { default: makeFooter("Chapter Six") }, children: [...ch6, pageBreak()] },
    { properties: { page: pageProps }, footers: { default: makeFooter("Chapter Nine") }, children: [...ch9, pageBreak()] },
    { properties: { page: pageProps }, footers: { default: makeFooter("Chapter Ten") }, children: [...ch10, pageBreak()] },
    { properties: { page: pageProps }, footers: { default: makeFooter("Chapter Eleven") }, children: [...ch11, pageBreak()] },
    { properties: { page: pageProps }, footers: { default: makeFooter("Chapter Thirteen") }, children: [...ch13, pageBreak()] },
    { properties: { page: pageProps }, footers: { default: makeFooter("Chapter Seventeen") }, children: ch17 }
  ]
});

Packer.toBuffer(bookDoc).then(buf => {
  fs.writeFileSync(__dirname + "/ZeroToHero_RadioOperator_Book.docx", buf);
  console.log("Book done.");
});
