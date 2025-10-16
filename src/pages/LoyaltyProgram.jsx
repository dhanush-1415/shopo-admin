import { Crown, Users, Award, Gift, TrendingUp, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const tiers = [
  { name: "Bronze", minPoints: 0, members: 342, color: "bg-amber-700", benefits: ["5% off", "Birthday reward"] },
  { name: "Silver", minPoints: 500, members: 156, color: "bg-gray-400", benefits: ["10% off", "Free shipping", "Early access"] },
  { name: "Gold", minPoints: 1000, members: 89, color: "bg-primary", benefits: ["15% off", "Free shipping", "Priority support", "Exclusive events"] },
  { name: "Platinum", minPoints: 2500, members: 23, color: "bg-purple-600", benefits: ["20% off", "Free express shipping", "VIP support", "All exclusive perks"] },
];

const pointsRules = [
  { action: "Purchase ($1 spent)", points: 1, type: "earn" },
  { action: "Product Review", points: 50, type: "earn" },
  { action: "Referral (successful)", points: 200, type: "earn" },
  { action: "Social Media Share", points: 25, type: "earn" },
  { action: "Birthday Bonus", points: 100, type: "earn" },
];

const rewards = [
  { id: 1, name: "$10 Off Coupon", points: 500, redeemed: 234, available: true },
  { id: 2, name: "$25 Off Coupon", points: 1200, redeemed: 145, available: true },
  { id: 3, name: "Free Product", points: 2000, redeemed: 67, available: true },
  { id: 4, name: "VIP Experience", points: 5000, redeemed: 12, available: true },
];

export default function LoyaltyProgram() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loyalty Program</h1>
          <p className="text-muted-foreground mt-1">Manage rewards and member tiers</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Award className="h-4 w-4 mr-2" />
          Program Settings
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">610</div>
            <p className="text-xs text-muted-foreground">+48 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Points Issued</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Redeemed</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">458</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Active participation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Member Tiers</CardTitle>
            <CardDescription>Current distribution of loyalty members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tiers.map((tier) => (
              <div key={tier.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className={`h-5 w-5 ${tier.color.replace('bg-', 'text-')}`} />
                    <div>
                      <p className="font-medium">{tier.name}</p>
                      <p className="text-xs text-muted-foreground">{tier.minPoints}+ points</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{tier.members}</p>
                    <p className="text-xs text-muted-foreground">members</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tier.benefits.map((benefit) => (
                    <Badge key={benefit} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
                <Progress 
                  value={(tier.members / 610) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Points Rules</CardTitle>
            <CardDescription>How customers earn loyalty points</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pointsRules.map((rule) => (
                <div key={rule.action} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="font-medium">{rule.action}</span>
                  </div>
                  <Badge className="bg-primary hover:bg-primary/90">
                    +{rule.points} pts
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rewards Catalog</CardTitle>
          <CardDescription>Available rewards for redemption</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reward Name</TableHead>
                <TableHead>Points Required</TableHead>
                <TableHead>Times Redeemed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell className="font-medium">{reward.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-primary" />
                      <span className="font-medium">{reward.points.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>{reward.redeemed}</TableCell>
                  <TableCell>
                    <Badge variant={reward.available ? "default" : "secondary"}>
                      {reward.available ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}