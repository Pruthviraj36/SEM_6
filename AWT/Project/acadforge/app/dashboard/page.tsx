import { getAuthUser } from "@/lib/auth";
import HackerHomePage from "../components/HackerHomePage";
import prisma from "@/lib/prisma";

export default async function Dashboard() {
    const user = await getAuthUser();
    let recentLogins: any[] = [];

    if (user) {
        recentLogins = await prisma.staffloginlog.findMany({
            where: { StaffID: user.staffId },
            orderBy: { LoginTime: 'desc' },
            take: 5
        });
    }

    return (
        <HackerHomePage user={user} recentLogins={JSON.parse(JSON.stringify(recentLogins))} />
    );
}
