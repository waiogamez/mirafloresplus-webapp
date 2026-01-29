import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonMenuButton,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonAvatar,
  IonBadge,
  IonButton,
  IonIcon,
  IonChip,
  IonFab,
  IonFabButton
} from '@ionic/react';
import { 
  add, 
  search, 
  person, 
  call, 
  mail,
  calendar,
  checkmarkCircle,
  closeCircle,
  timeOutline
} from 'ionicons/icons';
import { useState } from 'react';
import { useAffiliateStore } from '../store/useAffiliateStore';

export function AffiliatesListPage() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const affiliates = useAffiliateStore(state => state.affiliates);

  // Filter affiliates
  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = affiliate.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
                         affiliate.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
                         affiliate.id.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || affiliate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'suspended':
        return 'danger';
      default:
        return 'medium';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'pending':
        return 'Pendiente';
      case 'suspended':
        return 'Suspendido';
      default:
        return status;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Premium':
        return 'tertiary';
      case 'Básico':
        return 'primary';
      default:
        return 'medium';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Gestión de Afiliados</IonTitle>
        </IonToolbar>
        
        {/* Search Bar */}
        <IonToolbar>
          <IonSearchbar
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Buscar por nombre o ID..."
            animated
          />
        </IonToolbar>

        {/* Filters */}
        <IonToolbar>
          <IonSegment value={statusFilter} onIonChange={e => setStatusFilter(e.detail.value as string)}>
            <IonSegmentButton value="all">
              <IonLabel>Todos ({affiliates.length})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="active">
              <IonLabel>Activos</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pending">
              <IonLabel>Pendientes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="suspended">
              <IonLabel>Suspendidos</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="page-content">
          {/* Summary Cards */}
          <div className="quick-stats-grid" style={{ marginBottom: '16px' }}>
            <IonCard className="metric-card">
              <IonCardContent>
                <div style={{ textAlign: 'center' }}>
                  <IonIcon icon={checkmarkCircle} style={{ fontSize: '32px', color: 'var(--ion-color-success)' }} />
                  <h3 className="metric-value" style={{ color: 'var(--ion-color-success)' }}>
                    {affiliates.filter(a => a.status === 'active').length}
                  </h3>
                  <p className="metric-title">Activos</p>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard className="metric-card">
              <IonCardContent>
                <div style={{ textAlign: 'center' }}>
                  <IonIcon icon={timeOutline} style={{ fontSize: '32px', color: 'var(--ion-color-warning)' }} />
                  <h3 className="metric-value" style={{ color: 'var(--ion-color-warning)' }}>
                    {affiliates.filter(a => a.status === 'pending').length}
                  </h3>
                  <p className="metric-title">Pendientes</p>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard className="metric-card">
              <IonCardContent>
                <div style={{ textAlign: 'center' }}>
                  <IonIcon icon={closeCircle} style={{ fontSize: '32px', color: 'var(--ion-color-danger)' }} />
                  <h3 className="metric-value" style={{ color: 'var(--ion-color-danger)' }}>
                    {affiliates.filter(a => a.status === 'suspended').length}
                  </h3>
                  <p className="metric-title">Suspendidos</p>
                </div>
              </IonCardContent>
            </IonCard>
          </div>

          {/* Affiliates List */}
          <IonCard>
            <IonCardContent style={{ padding: 0 }}>
              {filteredAffiliates.length === 0 ? (
                <div className="empty-state">
                  <IonIcon icon={person} />
                  <h3>No se encontraron afiliados</h3>
                  <p>Intenta cambiar los filtros o la búsqueda</p>
                </div>
              ) : (
                <IonList lines="full">
                  {filteredAffiliates.map((affiliate) => (
                    <IonItem key={affiliate.id} button detail>
                      <IonAvatar slot="start">
                        <div style={{ 
                          width: '100%', 
                          height: '100%', 
                          background: 'var(--ion-color-primary)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '18px'
                        }}>
                          {affiliate.firstName.charAt(0)}{affiliate.lastName.charAt(0)}
                        </div>
                      </IonAvatar>

                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <IonLabel>
                            <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>
                              {affiliate.firstName} {affiliate.lastName}
                            </h3>
                            <p style={{ fontSize: '13px', color: '#6b7280' }}>
                              ID: {affiliate.id}
                            </p>
                          </IonLabel>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <IonChip color={getPlanColor(affiliate.plan)}>
                              {affiliate.plan}
                            </IonChip>
                            <IonBadge color={getStatusColor(affiliate.status)}>
                              {getStatusLabel(affiliate.status)}
                            </IonBadge>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#9ca3af', flexWrap: 'wrap' }}>
                          <span>
                            <IonIcon icon={mail} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            {affiliate.email}
                          </span>
                          <span>
                            <IonIcon icon={call} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                            {affiliate.phone}
                          </span>
                          {affiliate.nextAppointment && (
                            <span>
                              <IonIcon icon={calendar} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                              Próxima cita: {affiliate.nextAppointment}
                            </span>
                          )}
                        </div>
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        {/* FAB - Add Affiliate */}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}
