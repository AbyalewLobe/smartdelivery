import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminCustomerApi } from '../../api/adminApi';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export function Customers() {
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: () => adminCustomerApi.getCustomers().then(res => res.data.data || [])
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminCustomerApi.updateCustomerStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] });
      toast.success('Customer status updated');
    },
    onError: () => toast.error('Failed to update status')
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customers Management</h1>
        <p className="text-gray-600 mt-1">View and manage all customers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(customers) && customers.map((customer: any) => (
          <Card key={customer._id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{customer.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail size={16} />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>{customer.addresses?.length || 0} addresses</span>
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-4">
              Joined {new Date(customer.createdAt).toLocaleDateString()}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                if (confirm(`${customer.isActive ? 'Deactivate' : 'Activate'} this customer?`)) {
                  toggleStatusMutation.mutate({ 
                    id: customer._id, 
                    isActive: !customer.isActive 
                  });
                }
              }}
            >
              {customer.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
