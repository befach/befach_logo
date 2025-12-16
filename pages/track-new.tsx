import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabase';
import { ORIGINAL_SHIPMENT_STAGES } from '../lib/shipmentStages';
import { getCurrentSubStage } from '../lib/autoSubStageProgression';
import MainNav from '../components/MainNav';
import ShipmentTimeline from '../components/ShipmentTimeline';
import { FaShip, FaPlane, FaTruck, FaTrain, FaFileAlt, FaDownload, FaBox, FaCube, FaImage, FaFile, FaFilePdf, FaFileWord, FaFileExcel, FaSearch, FaArrowLeft, FaClock } from 'react-icons/fa';

// Function to convert sub-stage ID to description
const getSubStageDescription = (subStage: string): string => {
  const subStageMap: { [key: string]: string } = {
    'stage_1': 'Shipment information received by Befach',
    'stage_2': 'Picked up from supplier warehouse',
    'stage_3': 'Package received at Befach export facility',
    'stage_4': 'Customs export clearance submitted',
    'stage_5': 'Export clearance completed',
    'stage_6': 'Departed from Shenzhen International Airport',
    'stage_7': 'Arrived at transit hub',
    'stage_8': 'Departed transit hub',
    'stage_9': 'Arrived at port of entry',
    'stage_10': 'Document verification initiated (Customs)',
    'stage_11': 'Import duty & GST assessment under process',
    'stage_12': 'Customs inspection & clearance completed',
    'stage_13': 'Handed over to Befach local delivery hub',
    'stage_14': 'Out for delivery',
    'stage_15': 'Delivered'
  };
  
  return subStageMap[subStage] || subStage;
};

const styles = `
  @keyframes scroll {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }

  .marquee-wrapper {
    width: 100%;
    overflow: hidden;
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .marquee {
    display: inline-block;
    white-space: nowrap;
    padding: 0.75rem 0;
    animation: marquee 20s linear infinite;
  }

  @keyframes marquee {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(-100%);
    }
  }

  /* Mobile optimization for estimated delivery */
  @media (max-width: 768px) {
    .estimated-delivery-mobile {
      margin: 1rem 0;
      padding: 1rem;
      background: #f0fdf4;
      border: 2px solid #22c55e;
      border-radius: 0.5rem;
    }
    
    .estimated-delivery-mobile h4 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }
    
    .estimated-delivery-mobile p {
      font-size: 0.875rem;
      line-height: 1.4;
    }
  }
`;

// Define the shipment type
interface Shipment {
  id: string;
  tracking_id: string;
  status: string;
  subStage?: string;
  shipment_name?: string;
  origin_city?: string;
  origin_country?: string;
  destination_city?: string;
  destination_country?: string;
  current_location_city?: string;
  current_location_country?: string;
  transport_mode?: string;
  estimated_delivery?: string;
  package_count?: number;
  package_type?: string;
  weight?: number;
  dimensions?: string;
  contents?: string;
  pickup_dispatched_through?: string;
  transit_dispatched_through?: string;
  customer_dispatched_through?: string;
  hs_code?: string;
  customer_delivery_address?: string;
  shipment_notes?: string;
  shipper_name?: string;
  shipper_address?: string;
  buyer_name?: string;
  buyer_address?: string;
  client_email?: string;
  client_phone?: string;
  transit_start_date?: string;
  created_at: string;
  updated_at?: string;
}

const TrackNewPage: NextPage = () => {
  const router = useRouter();
  const [trackingId, setTrackingId] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stageMedia, setStageMedia] = useState<any[]>([]);
  const [shipmentDocuments, setShipmentDocuments] = useState<any[]>([]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  // Handle URL parameters for direct tracking links
  useEffect(() => {
    if (router.isReady && router.query.tracking_id) {
      const urlTrackingId = router.query.tracking_id as string;
      setTrackingId(urlTrackingId);
      // Automatically track the shipment
      handleDirectTrack(urlTrackingId);
    }
  }, [router.isReady, router.query.tracking_id]);

  const handleDirectTrack = async (trackingIdToTrack: string) => {
    if (!trackingIdToTrack.trim()) {
      setError('Please enter a tracking number');
      return;
    }
    
    setLoading(true);
    setError('');
    setShipment(null);
    
    try {
      console.log('Searching for tracking ID:', trackingIdToTrack);
      
      // Use maybeSingle() instead of single() to handle no results gracefully
      const { data, error: shipmentError } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_id', trackingIdToTrack)
        .maybeSingle();
      
      console.log('Query result:', { data, error: shipmentError });
      
      if (shipmentError) {
        console.error('Error fetching shipment:', shipmentError);
        setError('Failed to track shipment. Please try again.');
        return;
      }
      
      if (!data) {
        setError('No shipment found with this tracking number');
        return;
      }
      
      console.log('Shipment found:', data);
      setShipment(data);
      
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Failed to track shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (!trackingId.trim()) {
      setError('Please enter a tracking number');
      return;
    }
    
    setLoading(true);
    setError('');
    setShipment(null);
    
    try {
      console.log('Searching for tracking ID:', trackingId);
      
      // Use maybeSingle() instead of single() to handle no results gracefully
      const { data, error: shipmentError } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_id', trackingId)
        .maybeSingle();
      
      console.log('Query result:', { data, error: shipmentError });
      
      if (shipmentError) {
        console.error('Error fetching shipment:', shipmentError);
        setError('Failed to track shipment. Please try again.');
        return;
      }
      
      if (!data) {
        setError('No shipment found with this tracking number');
        return;
      }
      
      console.log('Shipment found:', data);
      setShipment(data);
      
    } catch (err) {
      console.error('Tracking error:', err);
      setError('Failed to track shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset the search and go back to the search form
  const handleReset = () => {
    setShipment(null);
    setError('');
    setTrackingId('');
  };

  // Get transport mode icon
  const getTransportIcon = (mode) => {
    if (!mode) return <FaTruck size={20} />;
    
    const modeLC = mode.toLowerCase();
    if (modeLC.includes('air') || modeLC.includes('plane')) {
      return <FaPlane size={20} />;
    } else if (modeLC.includes('sea') || modeLC.includes('ship')) {
      return <FaShip size={20} />;
    } else if (modeLC.includes('rail') || modeLC.includes('train')) {
      return <FaTrain size={20} />;
    } else {
      return <FaTruck size={20} />;
    }
  };

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!shipment) return 0;
    
    // Simple calculation based on current date between created_at and estimated delivery
    const createdDate = new Date(shipment.created_at).getTime();
    const estimatedDeliveryDate = new Date(getEstimatedDeliveryDate()).getTime();
    const currentDate = new Date().getTime();
    
    if (currentDate >= estimatedDeliveryDate) return 100;
    
    const totalDuration = estimatedDeliveryDate - createdDate;
    const elapsedDuration = currentDate - createdDate;
    
    return Math.min(Math.round((elapsedDuration / totalDuration) * 100), 100);
  };

  // Get estimated delivery date (5 days from creation for demo)
  const getEstimatedDeliveryDate = (): Date => {
    if (!shipment) return new Date();
    
    // Use the actual estimated_delivery if available
    if (shipment.estimated_delivery) {
      return new Date(shipment.estimated_delivery);
    }
    
    // Fallback to the old calculation if estimated_delivery is not set
    const createdDate = new Date(shipment.created_at);
    const estimatedDate = new Date(createdDate);
    
    // Set ETA based on transport mode
    if (shipment.transport_mode && shipment.transport_mode.toLowerCase().includes('air')) {
      estimatedDate.setDate(createdDate.getDate() + 15);
    } else if (shipment.transport_mode && shipment.transport_mode.toLowerCase().includes('sea')) {
      estimatedDate.setDate(createdDate.getDate() + 45);
    } else {
      estimatedDate.setDate(createdDate.getDate() + 30);
    }
    
    return estimatedDate;
  };
  
  // Format the estimated delivery date as a string
  const getEstimatedDeliveryString = (): string => {
    if (!shipment) return 'N/A';
    const estimatedDate = getEstimatedDeliveryDate();
    
    return estimatedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatLastUpdated = (timestamp: string) => {
    if (!timestamp) return 'No updates yet';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <FaImage className="text-blue-600 mr-3" />;
    } else if (fileType.includes('pdf')) {
      return <FaFilePdf className="text-blue-600 mr-3" />;
    } else if (fileType.includes('word') || fileType.includes('doc')) {
      return <FaFileWord className="text-blue-800 mr-3" />;
    } else if (fileType.includes('excel') || fileType.includes('sheet') || fileType.includes('xls')) {
      return <FaFileExcel className="text-green-600 mr-3" />;
    } else {
      return <FaFile className="text-gray-600 mr-3" />;
    }
  };

  const fetchStageMedia = async (shipmentId, stage) => {
    try {
      // First check if the table and column exist
      const { error: checkError } = await supabase
        .from('shipment_media')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.message.includes('does not exist')) {
        console.log('shipment_media table does not exist yet');
        setStageMedia([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('shipment_media')
        .select('*')
        .eq('shipment_id', shipmentId);
      
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log('Stage column may not exist in shipment_media table');
          setStageMedia([]);
        } else {
          throw error;
        }
      } else {
        // If we have data but no stage column, we'll just show all media
        setStageMedia(data || []);
      }
    } catch (err) {
      console.error('Error fetching stage media:', err);
      setStageMedia([]);
    }
  };

  const fetchShipmentDocuments = async (shipmentId) => {
    try {
      // First check if the table exists
      const { error: checkError } = await supabase
        .from('shipment_documents')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.message.includes('does not exist')) {
        console.log('shipment_documents table does not exist yet');
        setShipmentDocuments([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('shipment_documents')
        .select('*')
        .eq('shipment_id', shipmentId);
      
      if (error) throw error;
      setShipmentDocuments(data || []);
    } catch (err) {
      console.error('Error fetching shipment documents:', err);
      setShipmentDocuments([]);
    }
  };

  const determineCurrentStageIndex = () => {
    if (!shipment) return 0;
    
    const stages = ORIGINAL_SHIPMENT_STAGES;
    const currentStage = shipment.status;
    const index = stages.findIndex(stage => stage === currentStage);
    return index >= 0 ? index : 0;
  };

  useEffect(() => {
    if (shipment) {
      fetchStageMedia(shipment.id, shipment.status);
      fetchShipmentDocuments(shipment.id);
      setCurrentStageIndex(determineCurrentStageIndex());
    }
  }, [shipment]);

  // Removed 2-minute auto-refresh (reverted to 24-hour day-based progression)



  return (
    <>
      <Head>
        <title>Track Your Shipment | ShipTrack</title>
        <style jsx global>{styles}</style>
      </Head>
      
      <MainNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!shipment ? (
          // Show search form when no shipment is found
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Shipment</h1>
              <p className="text-gray-600">Enter your tracking number to get real-time updates on your shipment.</p>
            </div>
            
            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter tracking number"
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#F39C12] text-white px-6 py-2 rounded-md hover:bg-[#E67E22] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading ? 'Tracking...' : 'Track'}
                </button>
              </form>
              
              {error && (
                <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-md">
                  {error}
                </div>
              )}
            </div>
          </>
        ) : (
          // Show shipment details when a shipment is found
          <>
            {shipment.shipment_notes && (
              <div className="mb-6 bg-blue-50 border-2 border-blue-500 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-blue-600 font-medium text-lg">Important Note: </span>
                  <span className="text-blue-500 text-lg ml-2">{shipment.shipment_notes}</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shipment #{shipment.tracking_id}</h1>
                <p className="text-gray-600">
                  Current Status: <span className="font-medium">
                    {shipment.status}
                    {(() => {
                      // Use automatic progression for "In Transit to India" if no manual sub-stage
                      if (shipment.status === 'In Transit to India' && shipment.transit_start_date) {
                        const currentSubStage = getCurrentSubStage(new Date(shipment.transit_start_date));
                        return (
                          <span className="text-purple-600 ml-2">
                            - {getSubStageDescription(currentSubStage)}
                          </span>
                        );
                      }
                      // Fallback to manual sub-stage if available
                      if (shipment.subStage) {
                        return (
                          <span className="text-purple-600 ml-2">
                            - {getSubStageDescription(shipment.subStage)}
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </span>
                </p>
              </div>
              <button 
                onClick={handleReset}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaArrowLeft className="mr-2" />
                <span>Track Another Shipment</span>
              </button>
            </div>
            
            {/* Mobile Estimated Delivery Banner - Only visible on mobile */}
            <div className="lg:hidden mb-6">
              {shipment.estimated_delivery && (
                <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-green-800 mb-2">📅 Estimated Delivery</h3>
                  <p className="text-xl font-semibold text-green-700 mb-2">
                    {new Date(shipment.estimated_delivery).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-green-600">
                    {shipment.transport_mode?.toLowerCase().includes('air') ? '15 days from pickup (Air)' : 
                     shipment.transport_mode?.toLowerCase().includes('sea') ? '45 days from pickup (Sea)' : 
                     shipment.transport_mode ? '30 days from pickup (Default)' : 'Estimated delivery time'}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Shipment Summary and Details */}
              <div className="space-y-6 lg:col-span-1">
                {/* Shipment Summary Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Shipment Summary</h3>
                    
                    <div className="flex items-center text-gray-600 mb-4">
                      {getTransportIcon(shipment.transport_mode)}
                      <span className="ml-2">{shipment.transport_mode || 'Standard Shipping'}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">From</p>
                        <p className="font-medium">{shipment.origin_city}, {shipment.origin_country}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">To</p>
                        <p className="font-medium">{shipment.destination_city}, {shipment.destination_country}</p>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Shipment Progress</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-[#F39C12] h-2.5 rounded-full" 
                          style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Started</span>
                        <span>Current Progress</span>
                      </div>
                    </div>
                    
                    {/* Last Updated Information */}
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-center">
                        <FaClock className="h-5 w-5 text-blue-600 mr-3" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-800 mb-1">Last Updated</p>
                          <p className="text-lg font-semibold text-blue-900 mb-1">
                            {formatLastUpdated(shipment.updated_at || '')}
                          </p>
                          <p className="text-sm text-blue-700 font-medium">
                            {shipment.updated_at ? new Date(shipment.updated_at).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 'N/A'}
                          </p>
                          <p className="text-sm text-blue-600">
                            {shipment.updated_at ? new Date(shipment.updated_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: true
                            }) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Shipment Details Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <FaCube className="text-blue-600 mr-3" size={20} />
                      <h3 className="text-lg font-medium">Shipment Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm text-gray-600">Package Count</h4>
                        <p className="font-medium">{shipment.package_count || '1 Package'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-600">Package Type</h4>
                        <p className="font-medium">{shipment.package_type || 'Standard'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm text-gray-600">Weight</h4>
                        <p className="font-medium">{shipment.weight ? `${shipment.weight} kg` : 'N/A'}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-600">Dimensions</h4>
                        <p className="font-medium">{shipment.dimensions || 'N/A'}</p>
                      </div>

                      <div>
                        <h4 className="text-sm text-gray-600">HS Code</h4>
                        <p className="font-medium">{shipment.hs_code || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm text-gray-600">Package Contents</h4>
                      <p className="font-medium">{shipment.contents}</p>
                    </div>

                    {/* Estimated Delivery Section - Mobile Optimized */}
                    <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400 estimated-delivery-mobile">
                      <h4 className="text-sm font-medium text-green-800 mb-2">Estimated Delivery</h4>
                      {shipment.estimated_delivery ? (
                        <div>
                          <p className="font-medium text-green-700 text-base">
                            {new Date(shipment.estimated_delivery).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-green-600 mt-2">
                            {shipment.transport_mode?.toLowerCase().includes('air') ? '15 days from pickup (Air)' : 
                             shipment.transport_mode?.toLowerCase().includes('sea') ? '45 days from pickup (Sea)' : 
                             shipment.transport_mode ? '30 days from pickup (Default)' : 'Estimated delivery time'}
                          </p>
                        </div>
                      ) : (
                        <p className="font-medium text-green-600">Not specified</p>
                      )}
                    </div>

                    {/* Contact Information */}
                    <div className="border-t pt-4 mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Contact Information</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="text-sm text-gray-600">Shipper</h5>
                          <p className="font-medium">{shipment.shipper_name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{shipment.shipper_address || 'N/A'}</p>
                        </div>
                        
                        <div>
                          <h5 className="text-sm text-gray-600">Buyer</h5>
                          <p className="font-medium">{shipment.buyer_name || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{shipment.buyer_address || 'N/A'}</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm text-gray-600">Delivery Address</h5>
                        <p className="text-sm text-gray-500">{shipment.customer_delivery_address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Timeline and Documents */}
              <div className="lg:col-span-2 space-y-6">
                {/* Timeline Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium">Shipment Timeline</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Progress: {Math.round((currentStageIndex / (ORIGINAL_SHIPMENT_STAGES.length - 1)) * 100)}% Complete
                      </p>
                    </div>
                    

                    
                    {/* FedEx-style Timeline Component */}
                    <ShipmentTimeline 
                      key={`timeline-${shipment.id}-${shipment.updated_at}-${Date.now()}`} // Force complete re-render with timestamp
                      currentStage={shipment.status}
                      subStage={shipment.subStage} // Pass the sub-stage data
                      estimatedDelivery={shipment.estimated_delivery}
                      transitStartDate={shipment.transit_start_date} // Pass transit start date for auto progression
                      stageUpdatedDate={shipment.updated_at} // Pass stage updated date for auto progression
                    />
                  </div>
                </div>
                
                {/* Documents Card */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium mb-4">Shipment Documents</h3>
                    
                    <div className="space-y-4">
                      {shipmentDocuments.length > 0 ? (
                        shipmentDocuments.map(doc => (
                          <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              {getFileIcon(doc.file_type)}
                              <span>{doc.document_type === 'commercial_invoice' ? 'Commercial Invoice' : 
                                     doc.document_type === 'bill_of_lading' ? 'Bill of Lading' : 
                                     doc.document_type === 'packing_list' ? 'Packing List' : 
                                     doc.file_name}</span>
                            </div>
                            <a 
                              href={doc.public_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <span className="mr-1">Download</span>
                              <FaDownload />
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center">No documents available for this shipment</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TrackNewPage;