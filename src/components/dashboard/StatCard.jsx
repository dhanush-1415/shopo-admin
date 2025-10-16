import { Card } from '@/components/ui/card';

export function StatCard({ title, value, change, trend, icon: Icon }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          <p className={`text-sm mt-2 ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
            {change}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${trend === 'up' ? 'bg-success/10' : 'bg-destructive/10'}`}>
          <Icon className={`h-6 w-6 ${trend === 'up' ? 'text-success' : 'text-destructive'}`} />
        </div>
      </div>
    </Card>
  );
}