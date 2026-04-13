import { GetPostsArgs, PostDetails, PostEdge, Tag } from "./types";

const MOCK_AUTHOR = {
  name: "Sunkanmi Olawuwo",
  profilePicture:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
};

type MockPostRecord = {
  cursor: string;
  node: PostEdge["node"];
  details: PostDetails;
};

const MOCK_TAGS = {
  accessibility: {
    id: "tag-accessibility",
    name: "Accessibility",
    slug: "accessibility",
  },
  aiApplications: {
    id: "tag-ai-applications",
    name: "AI Applications",
    slug: "ai-applications",
  },
  backend: {
    id: "tag-backend",
    name: "Backend",
    slug: "backend",
  },
  cloudArchitecture: {
    id: "tag-cloud-architecture",
    name: "Cloud Architecture",
    slug: "cloud-architecture",
  },
  designSystems: {
    id: "tag-design-systems",
    name: "Design Systems",
    slug: "design-systems",
  },
  developerExperience: {
    id: "tag-developer-experience",
    name: "Developer Experience",
    slug: "developer-experience",
  },
  nextjs: {
    id: "tag-nextjs",
    name: "Next.js",
    slug: "nextjs",
  },
  testing: {
    id: "tag-testing",
    name: "Testing",
    slug: "testing",
  },
} satisfies Record<string, Tag>;

type MockTagKey = keyof typeof MOCK_TAGS;

function tags(...tagKeys: MockTagKey[]) {
  return tagKeys.map((tagKey) => MOCK_TAGS[tagKey]);
}

function cover(photoId: string) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1600&h=900&q=80`;
}

function article(intro: string, middle: string, closing: string) {
  return `<p>${intro}</p><p>${middle}</p><p>${closing}</p>`;
}

export const mockPublication = {
  title: "Sunkanmi Olawuwo",
  displayTitle: "Sunkanmi Olawuwo",
  favicon: "/favicon.ico",
};

const mockPostRecords: MockPostRecord[] = [
  {
    cursor: "mock-01",
    node: {
      title: "Building a design system without stalling product delivery",
      subtitle:
        "The system only started helping once we treated it like a product team, not a side quest.",
      slug: "building-a-design-system-without-stalling-product-delivery",
      content: {
        text: "Start from repeated UI pain, encode the smallest stable decisions, and let adoption grow alongside product work.",
      },
      coverImage: { url: cover("photo-1516321318423-f06f85e504b3") },
      author: MOCK_AUTHOR,
      tags: tags("designSystems", "developerExperience"),
    },
    details: {
      title: "Building a design system without stalling product delivery",
      subtitle:
        "The system only started helping once we treated it like a product team, not a side quest.",
      coverImage: { url: cover("photo-1516321318423-f06f85e504b3") },
      content: {
        html: article(
          "The first useful version of a design system is rarely a perfect library. It is usually a small set of shared decisions that removes the same review comments from every sprint.",
          "When I start this work, I look for the product surfaces that already hurt the team: inconsistent spacing, duplicated buttons, and screens that all feel slightly unrelated. Those are the places where tokens and shared components earn trust quickly.",
          "The system becomes valuable when it makes shipping easier this week, not when it promises elegance later. That is why I prefer small, adoptable slices over big rewrites."
        ),
      },
      author: MOCK_AUTHOR,
      tags: tags("designSystems", "developerExperience"),
    },
  },
  {
    cursor: "mock-02",
    node: {
      title: "Shipping a personal site on Next.js 16 without over-engineering it",
      subtitle:
        "The biggest improvements came from tightening the feedback loop, not adding more architecture.",
      slug: "shipping-a-personal-site-on-nextjs-16-without-over-engineering-it",
      content: {
        text: "A personal site gets better faster when publishing, testing, and previewing are easy enough to repeat.",
      },
      coverImage: { url: cover("photo-1498050108023-c5249f4df085") },
      author: MOCK_AUTHOR,
      tags: tags("nextjs", "developerExperience"),
    },
    details: {
      title: "Shipping a personal site on Next.js 16 without over-engineering it",
      subtitle:
        "The biggest improvements came from tightening the feedback loop, not adding more architecture.",
      coverImage: { url: cover("photo-1498050108023-c5249f4df085") },
      content: {
        html: article(
          "Personal sites are perfect places to overbuild because there is always one more abstraction that sounds responsible. In practice, the work that matters most is the work that makes the site easy to publish to.",
          "For me that meant getting the upgrade stable, making the pages render without external services, and building enough tests that design changes no longer felt risky. Once those basics were solid, the rest of the stack became much easier to reason about.",
          "A portfolio or blog should make writing and iteration feel lightweight. If the infrastructure keeps getting in the way, the project starts serving the code instead of the content."
        ),
      },
      author: MOCK_AUTHOR,
      tags: tags("nextjs", "developerExperience"),
    },
  },
  {
    cursor: "mock-03",
    node: {
      title: "Testing the happy path is not enough",
      subtitle:
        "The bugs that reached production all lived in the states we assumed nobody would hit.",
      slug: "testing-the-happy-path-is-not-enough",
      content: {
        text: "Error states, empty states, and partial configuration paths are where a lot of real product risk actually lives.",
      },
      coverImage: { url: cover("photo-1515879218367-8466d910aaa4") },
      author: MOCK_AUTHOR,
      tags: tags("testing", "backend"),
    },
    details: {
      title: "Testing the happy path is not enough",
      subtitle:
        "The bugs that reached production all lived in the states we assumed nobody would hit.",
      coverImage: { url: cover("photo-1515879218367-8466d910aaa4") },
      content: {
        html: article(
          "Most polished demos walk through the one path where data exists, the request is fast, and every control works the first time. Real users do not stay in that lane for very long.",
          "The most durable tests I write protect slow requests, missing configuration, empty datasets, and slightly broken flows. Those are the states that become outages, support threads, or confidence-draining product bugs.",
          "A strong test suite does not stop redesign work. It lets the team redesign faster because the edge cases that matter are already guarded."
        ),
      },
      author: MOCK_AUTHOR,
      tags: tags("testing", "backend"),
    },
  },
  {
    cursor: "mock-04",
    node: {
      title: "When server components actually help",
      subtitle:
        "They are best treated as a data-loading tool, not a replacement for every client interaction.",
      slug: "when-server-components-actually-help",
      content: {
        text: "The most useful boundary is the boring one: data on the server, interaction on the client, very little confusion in between.",
      },
      coverImage: { url: cover("photo-1516382799247-87df95d790b7") },
      author: MOCK_AUTHOR,
      tags: tags("backend", "nextjs"),
    },
    details: {
      title: "When server components actually help",
      subtitle:
        "They are best treated as a data-loading tool, not a replacement for every client interaction.",
      coverImage: { url: cover("photo-1516382799247-87df95d790b7") },
      content: {
        html: article(
          "Server components became easier for me to use once I stopped treating them like a movement and started treating them like a tool for specific jobs. They are excellent at getting data to a page close to the route that needs it.",
          "They are much less interesting when the component is mostly about local interaction, focus management, or client-side state. For those cases, forcing everything back to the server usually makes the code harder to follow.",
          "The cleanest systems keep that boundary obvious. Data enters on the server, interaction lives on the client, and neither side pretends to own the other."
        ),
      },
      author: MOCK_AUTHOR,
      tags: tags("backend", "nextjs"),
    },
  },
  {
    cursor: "mock-05",
    node: {
      title: "Designing loading states that feel intentional",
      subtitle: "Users can forgive waiting. They rarely forgive confusion.",
      slug: "designing-loading-states-that-feel-intentional",
      content: {
        text: "The best placeholders describe the shape of what is coming next and keep the page feeling calm while it loads.",
      },
      coverImage: { url: cover("photo-1517180102446-f3ece451e9d8") },
      author: MOCK_AUTHOR,
      tags: tags("designSystems", "developerExperience"),
    },
    details: {
      title: "Designing loading states that feel intentional",
      subtitle: "Users can forgive waiting. They rarely forgive confusion.",
      coverImage: { url: cover("photo-1517180102446-f3ece451e9d8") },
      content: {
        html: article(
          "Loading states work best when they resemble the destination. A content-heavy page should hint at text rhythm. A card grid should preserve the space those cards will occupy.",
          "I also like loading states that stay honest. They should suggest progress, but they should not pretend the page is ready before it actually is. A clear button state and stable layout does more for trust than flashy motion ever will.",
          "Good loading design is not extra polish. It is part of how the product explains itself when the network is doing normal network things."
        ),
      },
      author: MOCK_AUTHOR,
      tags: tags("designSystems", "developerExperience"),
    },
  },
  {
    cursor: "mock-06",
    node: {
      title: "Design tokens that scale with the team",
      subtitle:
        "Tokens work best when they preserve decisions, not when they multiply them.",
      slug: "design-tokens-that-scale-with-the-team",
      content: {
        text: "A small, intention-driven token set almost always survives better than a large one built from guesswork.",
      },
      coverImage: { url: cover("photo-1516321497487-e288fb19713f") },
      author: MOCK_AUTHOR,
      tags: tags("designSystems", "developerExperience"),
    },
    details: {
      title: "Design tokens that scale with the team",
      subtitle:
        "Tokens work best when they preserve decisions, not when they multiply them.",
      coverImage: { url: cover("photo-1516321497487-e288fb19713f") },
      content: {
        html: article(
          "I prefer token names that describe intent rather than raw values. Intent survives refreshes better, and it keeps teams focused on why a style exists in the first place.",
          "The biggest failure mode is usually too many choices too early. If every spacing step and shade looks plausible, the system stops guiding anybody and becomes another catalog the team has to interpret.",
          "A token set earns its keep when it reduces decisions, clarifies language, and stays small enough that people can actually remember it."
        ),
      },
      author: MOCK_AUTHOR,
      tags: tags("designSystems", "developerExperience"),
    },
  },
  {
    cursor: "mock-07",
    node: {
      title: "Small refactors that pay rent every week",
      subtitle:
        "The best refactors are the ones teammates stop noticing because the code got easier to live in.",
      slug: "small-refactors-that-pay-rent-every-week",
      content: {
        text: "Naming, boundaries, and dead-code cleanup are often more valuable than the dramatic rewrite everybody remembers.",
      },
      coverImage: { url: cover("photo-1522071820081-009f0129c71c") },
      author: MOCK_AUTHOR,
      tags: tags("backend", "developerExperience"),
    },
    details: {
      title: "Small refactors that pay rent every week",
      subtitle:
        "The best refactors are the ones teammates stop noticing because the code got easier to live in.",
      coverImage: { url: cover("photo-1522071820081-009f0129c71c") },
      content: {
        html: article(
          "Not every refactor has to announce itself with a new architecture diagram. Some of the most valuable ones are quieter: deleting dead branches, clarifying names, and tightening boundaries that keep confusing everybody.",
          "Those changes are easier to review, easier to test, and much more likely to survive because they solve real friction that the team already feels every day.",
          "I measure a good refactor by whether the next engineer understands the intent faster. If that gets easier, the refactor is already paying for itself."
        ),
      },
      author: MOCK_AUTHOR,
      tags: tags("backend", "developerExperience"),
    },
  },
  {
    cursor: "mock-08",
    node: {
      title: "Writing docs that onboard people faster",
      subtitle:
        "Good documentation reduces anxiety before it reduces mistakes.",
      slug: "writing-docs-that-onboard-people-faster",
      content: {
        text: "The most helpful docs answer the first questions a teammate is quietly hoping not to ask in public.",
      },
      coverImage: { url: cover("photo-1455390582262-044cdead277a") },
      author: MOCK_AUTHOR,
      tags: tags("developerExperience", "backend"),
    },
    details: {
      title: "Writing docs that onboard people faster",
      subtitle:
        "Good documentation reduces anxiety before it reduces mistakes.",
      coverImage: { url: cover("photo-1455390582262-044cdead277a") },
      content: {
        html: article(
          "The best onboarding docs do not begin with a grand theory of the system. They begin with the first successful command, the key paths a newcomer should care about, and the common places somebody might get stuck.",
          "That style of documentation lowers anxiety as much as it lowers defects. It tells people they are allowed to need orientation and that the repo expects to help them.",
          "Short, close-to-the-code docs age better than a giant handbook nobody trusts. The goal is less uncertainty, not maximal explanation."
        ),
      },
      author: MOCK_AUTHOR,
      tags: tags("developerExperience", "backend"),
    },
  },
  {
    cursor: "mock-09",
    node: {
      title: "How I review pull requests for risk",
      subtitle:
        "A good review looks past style first and asks what could break for real users.",
      slug: "how-i-review-pull-requests-for-risk",
      content: {
        text: "The most valuable review comments usually point at changed behavior, missing tests, and risky edge cases.",
      },
      coverImage: { url: cover("photo-1517694712202-14dd9538aa97") },
      author: MOCK_AUTHOR,
      tags: tags("testing", "developerExperience"),
    },
    details: {
      title: "How I review pull requests for risk",
      subtitle:
        "A good review looks past style first and asks what could break for real users.",
      coverImage: { url: cover("photo-1517694712202-14dd9538aa97") },
      content: {
        html: article(
          "The easiest review comments to leave are about formatting and naming. The highest-value comments are usually about behavior risk: what changed, what could regress, and which state nobody has tested yet.",
          "I try to understand the user-facing delta first, then read the implementation through that lens. That makes it much easier to spot missing failure handling or a subtle regression hiding behind otherwise tidy code.",
          "Review quality compounds through tone too. The best comments make the code safer and help the author move forward without turning the process into a performance."
        ),
      },
      author: MOCK_AUTHOR,
      tags: tags("testing", "developerExperience"),
    },
  },
  {
    cursor: "mock-10",
    node: {
      title: "Balancing speed and code quality on a small team",
      subtitle:
        "The real goal is sustainable pace, not maximum short-term throughput.",
      slug: "balancing-speed-and-code-quality-on-a-small-team",
      content: {
        text: "Teams move faster when they invest in the kinds of quality that prevent repeated friction, not when they add process everywhere.",
      },
      coverImage: { url: cover("photo-1521737604893-d14cc237f11d") },
      author: MOCK_AUTHOR,
      tags: tags("backend", "cloudArchitecture"),
    },
    details: {
      title: "Balancing speed and code quality on a small team",
      subtitle:
        "The real goal is sustainable pace, not maximum short-term throughput.",
      coverImage: { url: cover("photo-1521737604893-d14cc237f11d") },
      content: {
        html: article(
          "Speed and quality are often framed as opponents, but most strong teams treat them as a partnership. They protect the places where mistakes are expensive and keep the rest of the process deliberately lightweight.",
          "That means using debt intentionally, naming it clearly, and returning to it before it becomes the team’s permanent operating model. Unnamed debt is where pace quietly starts to rot.",
          "When a fix keeps showing up in reviews, incidents, or onboarding pain, it is asking to become a shared solution. That is usually where tests, docs, and reusable UI start paying back their cost."
        ),
      },
      author: MOCK_AUTHOR,
      tags: tags("backend", "cloudArchitecture"),
    },
  },
  {
    cursor: "mock-11",
    node: {
      title: "Accessibility fixes that raise the floor for everyone",
      subtitle:
        "Many of the best accessibility wins also make the interface clearer, steadier, and easier to trust.",
      slug: "accessibility-fixes-that-raise-the-floor-for-everyone",
      content: {
        text: "Semantics, contrast, and feedback loops are product quality work, not extra polish for later.",
      },
      coverImage: { url: cover("photo-1484417894907-623942c8ee29") },
      author: MOCK_AUTHOR,
      tags: tags("accessibility", "designSystems"),
    },
    details: {
      title: "Accessibility fixes that raise the floor for everyone",
      subtitle:
        "Many of the best accessibility wins also make the interface clearer, steadier, and easier to trust.",
      coverImage: { url: cover("photo-1484417894907-623942c8ee29") },
      content: {
        html: article(
          "Accessibility work often gets framed like a specialized checklist, but the most common fixes improve the product for almost everybody. Better semantics, stronger contrast, and clearer states make interfaces easier to understand under normal conditions too.",
          "Those improvements also make automated tests more stable because the page exposes stronger public affordances. Good buttons, links, headings, and feedback messages help both users and tooling find the right thing.",
          "Once accessibility becomes part of the baseline, redesign work gets easier because the team is no longer rediscovering the same foundational issues on every feature."
        ),
      },
      author: MOCK_AUTHOR,
      tags: tags("accessibility", "designSystems"),
    },
  },
  {
    cursor: "mock-12",
    node: {
      title: "Building a mock data layer that is realistic enough for design work",
      subtitle:
        "Mock content becomes useful when it looks believable, paginates properly, and exercises the same contracts as production data.",
      slug: "building-a-mock-data-layer-that-is-realistic-enough-for-design-work",
      content: {
        text: "A realistic mock layer turns blog pages into something you can genuinely design against instead of merely proving that the app compiles.",
      },
      coverImage: { url: cover("photo-1496171367470-9ed9a91ea931") },
      author: MOCK_AUTHOR,
      tags: tags("testing", "aiApplications"),
    },
    details: {
      title: "Building a mock data layer that is realistic enough for design work",
      subtitle:
        "Mock content becomes useful when it looks believable, paginates properly, and exercises the same contracts as production data.",
      coverImage: { url: cover("photo-1496171367470-9ed9a91ea931") },
      content: {
        html: article(
          "A single placeholder card is enough to prove that a route renders. It is not enough to help a team refine hierarchy, spacing, pagination, or the feel of a real reading experience.",
          "The mock layer gets dramatically more useful once it mirrors the live contract: publication metadata, paginated edges, realistic article bodies, and stable slugs that behave like the real thing.",
          "That is the point where design, engineering, and testing can all work against the same believable preview instead of waiting on an external content source to be available."
        ),
      },
      author: MOCK_AUTHOR,
      tags: tags("testing", "aiApplications"),
    },
  },
];

export const mockPostEdges: PostEdge[] = mockPostRecords.map(
  ({ cursor, node }) => ({
    cursor,
    node,
  }),
);

const mockPostDetailsBySlug = Object.fromEntries(
  mockPostRecords.map(({ details, node }) => [node.slug, details]),
) as Record<string, PostDetails>;

export const mockPostSlugs = mockPostEdges.map((post) => post.node.slug);

export function getMockPostsPage({
  first = 9,
  pageParam = "",
  tagSlug,
}: GetPostsArgs) {
  const filteredPostEdges = tagSlug
    ? mockPostEdges.filter((post) =>
        post.node.tags.some((tag) => tag.slug === tagSlug),
      )
    : mockPostEdges;

  if (!pageParam) {
    return filteredPostEdges.slice(0, first);
  }

  const startIndex = filteredPostEdges.findIndex(
    (post) => post.cursor === pageParam,
  );

  if (startIndex === -1) {
    return [];
  }

  return filteredPostEdges.slice(startIndex + 1, startIndex + 1 + first);
}

export function getMockPostBySlug(slug: string) {
  return mockPostDetailsBySlug[slug] ?? null;
}
