import { getCollection } from "@/lib/mongo";
import PartnersList from "@/components/partners-list";

export default async function PartnersPage() {
    const configs = await getCollection<{ _id: string; data: Array<string | { name: string; url?: string }> }>("configs");
    const doc = await configs.findOne({ _id: "partners" });
    const partners = (doc?.data || []) as Array<string | { name: string; url?: string }>;

    // Normalize and shuffle
    const items: { name: string; url?: string }[] = partners
        .map((p) => (typeof p === "string" ? { name: p } : { name: p.name, url: p.url }))
        .filter((x) => x.name);

    for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = items[i];

        items[i] = items[j];
        items[j] = tmp;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-32">
            <div className="container px-6 mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-semibold tracking-wider text-gray-600 uppercase bg-gray-100/80 backdrop-blur-sm rounded-full border border-gray-200">
                        <svg className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Partner Network
                    </div>
                    <h1 className="mb-6 text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-tight">
                        Trusted <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-900 bg-clip-text text-transparent">Partners</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-xl text-gray-600 leading-relaxed">
                        Collaborating with industry leaders to deliver exceptional results
                    </p>
                </div>

                {/* Partners List with Search */}
                <PartnersList partners={items} />

                {/* Stats Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-violet-600 to-purple-900 p-px">
                        <div className="relative rounded-3xl bg-white p-8 md:p-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                                <div className="space-y-2">
                                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                                        {items.length}+
                                    </div>
                                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                                        Active Partners
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-900 bg-clip-text text-transparent">
                                        100%
                                    </div>
                                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                                        Satisfaction Rate
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-900 to-pink-600 bg-clip-text text-transparent">
                                        24/7
                                    </div>
                                    <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                                        Dedicated Support
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}