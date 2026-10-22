"use strict";

/* ---------- Data ---------- */

const participants = [
  {
    role: "Project Manager",
    points: [
      "Ensures the product is developed on schedule.",
      "Monitors progress and issues in the SCM process.",
      "Makes sure processes and policies are followed."
    ]
  },
  {
    role: "Configuration Manager",
    points: [
      "Identifies configuration items.",
      "Ensures the team follows the SCM process.",
      "Approves or rejects change requests."
    ]
  },
  {
    role: "Developer",
    points: [
      "Changes the code per change request and maintains its configuration.",
      "Checks for changes and resolves conflicts."
    ]
  },
  {
    role: "User",
    points: [
      "Understands basic SCM terms and processes.",
      "Makes sure they are using the latest version of the software."
    ]
  }
];

const promotionLevels = [
  "Developed",
  "Functionally tested",
  "Component tested",
  "System tested (golden copy)"
];

const namingFields = [
  { label: "PP product", size: 2, value: "SC", numeric: false, meaning: "product code" },
  { label: "CC country", size: 2, value: "PH", numeric: false, meaning: "country code" },
  { label: "RRR release", size: 3, value: "001", numeric: true, meaning: "release number" },
  { label: "VVV version", size: 3, value: "002", numeric: true, meaning: "version within the release" },
  { label: "TT type", size: 2, value: "RQ", numeric: false, meaning: "artifact type" },
  { label: "FF format", size: 2, value: "DC", numeric: false, meaning: "artifact format" }
];

const quizQuestions = [
  {
    question: "What are the two main models of the configuration management framework?",
    options: ["Build and release", "Naming and storage/access", "Compile and link", "Branch and merge"],
    answer: 1
  },
  {
    question: "In the sample naming model, what does RRR stand for?",
    options: ["Release number", "Review round", "Requirement rank", "Rollback record"],
    answer: 0
  },
  {
    question: "Which build is done for the users' runtime environment, not just the developers'?",
    options: ["Partial build", "Nightly build", "Final build", "Incremental build"],
    answer: 2
  },
  {
    question: "Which SCM tool feature lets you roll back to an earlier version?",
    options: ["Version control", "Synchronization", "Concurrency", "Compilation"],
    answer: 0
  },
  {
    question: "Who approves or rejects change requests?",
    options: ["Developer", "User", "Project Manager", "Configuration Manager"],
    answer: 3
  }
];

/* ---------- Helpers ---------- */

function byId(id) {
  return document.getElementById(id)
}

function makeEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) {
    el.className = className;
  }
  if (text !== undefined) {
    el.textContent = text;
  }
  return el;
}

/* ---------- Participants tabs ---------- */

function setupParticipants() {
  const tabs = byId("participant-tabs");
  const panel = byId("participant-panel");
  if (!tabs || !panel) {
    return;
  }

  function show(index) {
    tabs.querySelectorAll("button").forEach(function (btn, i) {
      btn.setAttribute("aria-selected", String(i === index));
    });
    panel.textContent = "";
    panel.appendChild(makeEl("h3", "", participants[index].role));
    const list = makeEl("ul");
    participants[index].points.forEach(function (point) {
      list.appendChild(makeEl("li", "", point));
    });
    panel.appendChild(list);
  }

  participants.forEach(function (person, index) {
    const btn = makeEl("button", "tab", person.role);
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.addEventListener("click", function () {
      show(index);
    });
    tabs.appendChild(btn);
  });

  show(0);
}

/* ---------- Promotion pipeline ---------- */

function setupPipeline() {
  const list = byId("pipeline");
  const promote = byId("promote-btn");
  const reset = byId("reset-btn");
  const status = byId("pipeline-status");
  if (!list || !promote || !reset || !status) {
    return;
  }

  let level = 0;

  function render() {
    list.textContent = "";
    promotionLevels.forEach(function (name, i) {
      const item = makeEl("li", "", name);
      if (i < level) {
        item.className = "done";
      } else if (i === level) {
        item.className = "current";
      }
      list.appendChild(item);
    });

    const atTop = level === promotionLevels.length - 1;
    promote.disabled = atTop;
    status.textContent = atTop
      ? "Golden copy reached. This code is locked and cannot regress."
      : "Next: pass the test to reach \"" + promotionLevels[level + 1] + "\".";
  }

  promote.addEventListener("click", function () {
    if (level < promotionLevels.length - 1) {
      level += 1;
      render();
    }
  });

  reset.addEventListener("click", function () {
    level = 0;
    render();
  });

  render();
}

/* ---------- Naming model builder ---------- */

function setupNamingBuilder() {
  const container = byId("naming-fields");
  const output = byId("naming-output");
  const meaning = byId("naming-meaning");
  if (!container || !output || !meaning) {
    return;
  }

  const inputs = [];

  function clean(field, raw) {
    const value = raw.trim().toUpperCase();
    if (field.numeric) {
      return value.replace(/\D/g, "").padStart(field.size, "0");
    }
    return value.padEnd(field.size, "X");
  }

  function update() {
    const parts = namingFields.map(function (field, i) {
      return clean(field, inputs[i].value);
    });
    output.textContent = parts.join(".");
    meaning.textContent = namingFields
      .map(function (field, i) {
        return parts[i] + " = " + field.meaning;
      })
      .join(" · ");
  }

  namingFields.forEach(function (field) {
    const wrap = makeEl("label", "field", field.label);
    const input = document.createElement("input");
    input.type = "text";
    input.value = field.value;
    input.maxLength = field.size;
    input.autocomplete = "off";
    input.spellcheck = false;
    if (field.numeric) {
      input.inputMode = "numeric";
    }
    input.addEventListener("input", update);
    wrap.appendChild(input);
    container.appendChild(wrap);
    inputs.push(input);
  });

  update();
}

/* ---------- Quiz ---------- */

function setupQuiz() {
  const card = byId("quiz-card");
  if (!card) {
    return;
  }

  let index = 0;
  let score = 0;

  function renderResult() {
    card.textContent = "";
    card.appendChild(makeEl("p", "question", "You scored " + score + " out of " + quizQuestions.length + "."));
    const again = makeEl("button", "btn", "Try again");
    again.type = "button";
    again.addEventListener("click", function () {
      index = 0;
      score = 0;
      renderQuestion();
    });
    card.appendChild(again);
  }

  function renderQuestion() {
    const item = quizQuestions[index];
    card.textContent = "";
    card.appendChild(makeEl("p", "small", "Question " + (index + 1) + " of " + quizQuestions.length));
    card.appendChild(makeEl("p", "question", item.question));

    const options = makeEl("div", "options");
    const feedback = makeEl("p", "feedback");
    feedback.setAttribute("aria-live", "polite");
    const next = makeEl("button", "btn", index === quizQuestions.length - 1 ? "See score" : "Next");
    next.type = "button";
    next.hidden = true;

    item.options.forEach(function (text, i) {
      const btn = makeEl("button", "option", text);
      btn.type = "button";
      btn.addEventListener("click", function () {
        options.querySelectorAll("button").forEach(function (b, bi) {
          b.disabled = true;
          if (bi === item.answer) {
            b.classList.add("correct");
          }
        });
        if (i === item.answer) {
          score += 1;
          feedback.textContent = "Correct.";
        } else {
          btn.classList.add("wrong");
          feedback.textContent = "Not quite. The right answer is highlighted.";
        }
        next.hidden = false;
      });
      options.appendChild(btn);
    });

    next.addEventListener("click", function () {
      index += 1;
      if (index < quizQuestions.length) {
        renderQuestion();
      } else {
        renderResult();
      }
    });

    card.appendChild(options);
    card.appendChild(feedback);
    card.appendChild(next);
  }

  renderQuestion();
}

/* ---------- Active nav link ---------- */

function setupNavHighlight() {
  const links = document.querySelectorAll("nav a");
  if (!("IntersectionObserver" in window) || links.length === 0) {
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  links.forEach(function (link) {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      observer.observe(target);
    }
  });
}

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", function () {
  setupParticipants();
  setupPipeline();
  setupNamingBuilder();
  setupQuiz();
  setupNavHighlight();
});
