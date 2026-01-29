import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBadge,
  IonButtons,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/react';
import {
  trendingUp,
  people,
  cash,
  medkit,
  statsChart,
  downloadOutline,
  calendar,
  documentText
} from 'ionicons/icons';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { mes: 'Jul', ingresos: 245000, gastos: 180000, pacientes: 320 },
  { mes: 'Ago', ingresos: 265000, gastos: 185000, pacientes: 340 },
  { mes: 'Sep', ingresos: 278000, gastos: 190000, pacientes: 355 },
  { mes: 'Oct', ingresos: 285000, gastos: 195000, pacientes: 368 },
  { mes: 'Nov', ingresos: 298000, gastos: 198000, pacientes: 380 },
  { mes: 'Dic', ingresos: 310000, gastos: 200000, pacientes: 395 },
];

export function BoardDashboard() {
  const user = useAuthStore(state => state.user);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const metrics = [
    { 
      title: 'Ingresos Totales', 
      value: 'Q 1.68M', 
      icon: cash, 
      color: 'success',
      subtitle: '+15.2% vs año anterior',
      percentage: '+15.2%'
    },
    { 
      title: 'Pacientes Activos', 
      value: '2,158', 
      icon: people, 
      color: 'primary',
      subtitle: '+8.5% este mes',
      percentage: '+8.5%'
    },
    { 
      title: 'Consultas Realizadas', 
      value: '4,856', 
      icon: medkit, 
      color: 'tertiary',
      subtitle: 'Este semestre',
      percentage: '+12.3%'
    },
    { 
      title: 'Margen de Beneficio', 
      value: '35.8%', 
      icon: statsChart, 
      color: 'secondary',
      subtitle: '+2.1% vs trimestre anterior',
      percentage: '+2.1%'
    }
  ];

  const topDoctors = [
    { name: 'Dr. Carlos Hernández', patients: 156, revenue: 'Q 45,200', satisfaction: '4.9' },
    { name: 'Dra. María López', patients: 142, revenue: 'Q 42,100', satisfaction: '4.8' },
    { name: 'Dr. Roberto Méndez', patients: 138, revenue: 'Q 40,500', satisfaction: '4.7' },
    { name: 'Dra. Ana Martínez', patients: 129, revenue: 'Q 38,900', satisfaction: '4.8' },
  ];

  const servicios_performance = [
    { service: 'Consulta General', count: 1856, revenue: 'Q 285,450' },
    { service: 'Especialidades', count: 1245, revenue: 'Q 425,200' },
    { service: 'Laboratorio', count: 856, revenue: 'Q 128,450' },
    { service: 'Imagenología', count: 645, revenue: 'Q 225,800' },
    { service: 'Emergencias', count: 254, revenue: 'Q 95,300' },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Panel Ejecutivo</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>¡Bienvenido, {user?.firstName}!</h2>
          <p>Vista ejecutiva y análisis de rendimiento</p>
        </div>

        <div className="page-content">
          {/* Period Selector */}
          <IonCard>
            <IonCardContent>
              <IonSegment value={selectedPeriod} onIonChange={e => setSelectedPeriod(e.detail.value as string)}>
                <IonSegmentButton value="week">
                  <IonLabel>Semana</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="month">
                  <IonLabel>Mes</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="quarter">
                  <IonLabel>Trimestre</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="year">
                  <IonLabel>Año</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </IonCardContent>
          </IonCard>

          {/* Quick Actions */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Reportes Ejecutivos</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="quick-actions">
                <IonButton expand="block" routerLink="/reports/executive" color="primary">
                  <IonIcon slot="start" icon={statsChart} />
                  Informe Ejecutivo
                </IonButton>
                <IonButton expand="block" routerLink="/reports/financial" color="success">
                  <IonIcon slot="start" icon={downloadOutline} />
                  Reporte Financiero
                </IonButton>
                <IonButton expand="block" routerLink="/analytics" color="secondary" fill="outline">
                  <IonIcon slot="start" icon={documentText} />
                  Analytics Detallados
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          {/* KPIs Grid */}
          <div className="quick-stats-grid">
            {metrics.map((metric, index) => (
              <IonCard key={index} className="metric-card">
                <IonCardContent>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ fontSize: '32px', color: `var(--ion-color-${metric.color})` }}>
                      <IonIcon icon={metric.icon} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className="metric-title">{metric.title}</p>
                      <h3 className="metric-value" style={{ color: `var(--ion-color-${metric.color})` }}>
                        {metric.value}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <IonIcon icon={trendingUp} style={{ fontSize: '14px', color: '#16a34a' }} />
                        <p style={{ fontSize: '12px', color: '#16a34a', margin: 0, fontWeight: 600 }}>
                          {metric.percentage}
                        </p>
                      </div>
                      <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                        {metric.subtitle}
                      </p>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>

          {/* Revenue Chart */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={trendingUp} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Ingresos vs Gastos (Últimos 6 Meses)
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => `Q ${Number(value).toLocaleString()}`}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb' }}
                    />
                    <Legend />
                    <Bar dataKey="ingresos" fill="#62BF04" name="Ingresos" />
                    <Bar dataKey="gastos" fill="#0477BF" name="Gastos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Top Doctors */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={medkit} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Médicos con Mejor Desempeño
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topDoctors.map((doctor, index) => (
                  <div key={index} style={{ 
                    padding: '16px', 
                    background: '#f9fafb', 
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ fontWeight: 600, margin: '0 0 4px 0' }}>
                          {index + 1}. {doctor.name}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                          {doctor.patients} pacientes • Satisfacción: {doctor.satisfaction}/5.0
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 700, color: '#16a34a', margin: 0 }}>
                          {doctor.revenue}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </IonCardContent>
          </IonCard>

          {/* Services Performance */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={statsChart} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Rendimiento por Servicio
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {serviciosPerformance.map((service, index) => (
                  <div key={index} style={{ 
                    padding: '16px', 
                    background: '#f9fafb', 
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: 600, margin: '0 0 4px 0' }}>
                          {service.service}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                          {service.count} servicios realizados
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 700, color: '#0477BF', margin: 0 }}>
                          {service.revenue}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
