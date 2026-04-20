'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/lib/cart-context'
import { supabase } from '@/lib/supabase'

export default function CartDrawer() {
  const { items, removeItem, updateQty, clearCart, totalItems, totalPrice } = useCart()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderNumber, setOrderNumber] = useState(0)

  // Form state
  const [customerName, setCustomerName] = useState('')
  const [contactPlatform, setContactPlatform] = useState('')
  const [contactHandle, setContactHandle] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')

  useEffect(() => {
    const handler = () => setOpen(prev => !prev)
    window.addEventListener('toggle-cart', handler)
    return () => window.removeEventListener('toggle-cart', handler)
  }, [])

  const handleCheckout = async () => {
    setError('')
    
    if (!customerName.trim()) { setError('Please enter your name'); return }
    if (!contactPlatform) { setError('Please select a contact platform'); return }
    if (!contactHandle.trim()) { setError('Please enter your @ or phone'); return }
    if (!deliveryAddress.trim()) { setError('Please enter your delivery address'); return }

    setLoading(true)

    try {
      // 1. Create or find customer
      let customerId = null
      
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('customer_name', customerName.trim())
        .eq('platform', contactPlatform)
        .single()

      if (existingCustomer) {
        customerId = existingCustomer.id
        await supabase
          .from('customers')
          .update({ known_addresses: deliveryAddress.trim() })
          .eq('id', customerId)
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            customer_name: customerName.trim(),
            platform: contactPlatform,
            platform_handle: contactHandle.trim(),
            known_addresses: deliveryAddress.trim(),
            status: 'active'
          })
          .select('id')
          .single()

        if (customerError) throw customerError
        customerId = newCustomer.id
      }

      // 2. Get next order number
      const { data: maxOrder } = await supabase
        .from('orders')
        .select('order_number')
        .order('order_number', { ascending: false })
        .limit(1)
        .single()

      const nextOrderNumber = (maxOrder?.order_number || 0) + 1

      // 3. Prepare order items
      const itemsJson = items.map(item => ({
        product_id: item.id,
        name: item.name,
        brand: item.brand,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }))

      const notesStr = items.map(item => `${item.quantity}x ${item.name}${item.brand ? ` (${item.brand})` : ''}`).join(', ')

      // 4. Create order with status 'pending'
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: nextOrderNumber,
          customer_id: customerId,
          customer_name: customerName.trim(),
          delivery_address: deliveryAddress.trim(),
          items: itemsJson,
          total: totalPrice,
          payment_method: 'cash',
          payment_status: 'pending',
          order_status: 'pending',
          platform: contactPlatform,
          notes: notesStr
        })

      if (orderError) throw orderError

      // Success!
      setOrderNumber(nextOrderNumber)
      setStep('success')
      clearCart()
      
      // Reset form
      setCustomerName('')
      setContactPlatform('')
      setContactHandle('')
      setDeliveryAddress('')

    } catch (err) {
      console.error('Checkout error:', err)
      setError('Error placing order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => {
      setStep('cart')
      setError('')
    }, 300)
  }

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={handleClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 200,
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '420px',
        background: 'var(--bg-2)',
        borderLeft: '1px solid var(--border)',
        zIndex: 201,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              letterSpacing: '2px',
            }}>
              {step === 'cart' ? 'YOUR CART' : step === 'checkout' ? 'CHECKOUT' : 'ORDER PLACED'}
            </h2>
            {step === 'cart' && (
              <span style={{
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
              }}>
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              background: 'var(--bg-3)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
              fontSize: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          
          {/* CART VIEW */}
          {step === 'cart' && (
            <>
              {items.length === 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  gap: '12px',
                  color: 'var(--text-muted)',
                }}>
                  <span style={{ fontSize: '48px' }}>🛒</span>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '2px' }}>
                    CART IS EMPTY
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {items.map(item => (
                    <div key={item.id} style={{
                      background: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '14px',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                    }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '8px',
                        background: 'var(--bg-3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '22px',
                        flexShrink: 0,
                      }}>
                        {item.image_url
                          ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                          : '📦'}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        {item.brand && (
                          <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '2px' }}>
                            {item.brand.toUpperCase()}
                          </div>
                        )}
                        <div style={{ fontSize: '13px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </div>
                        <div style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '14px',
                          color: 'var(--accent)',
                          marginTop: '4px',
                        }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          style={{
                            width: '26px', height: '26px',
                            borderRadius: '50%',
                            background: 'var(--bg-3)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-muted)',
                            fontSize: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >−</button>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '13px',
                          minWidth: '20px',
                          textAlign: 'center',
                        }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          style={{
                            width: '26px', height: '26px',
                            borderRadius: '50%',
                            background: 'var(--bg-3)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-muted)',
                            fontSize: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >+</button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          width: '28px', height: '28px',
                          borderRadius: '50%',
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-dim)',
                          fontSize: '16px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* CHECKOUT VIEW */}
          {step === 'checkout' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Fill in your details and we'll contact you to confirm the order.
              </p>

              {error && (
                <div style={{
                  background: 'rgba(255,77,109,0.1)',
                  border: '1px solid rgba(255,77,109,0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: 'var(--accent-3)',
                  fontSize: '13px',
                }}>
                  {error}
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '1px' }}>
                  YOUR NAME *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '1px' }}>
                    PLATFORM *
                  </label>
                  <select
                    value={contactPlatform}
                    onChange={e => setContactPlatform(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '14px',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="Telegram">Telegram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Snapchat">Snapchat</option>
                    <option value="Discord">Discord</option>
                    <option value="Signal">Signal</option>
                    <option value="iMessage">iMessage</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '1px' }}>
                    @ OR PHONE *
                  </label>
                  <input
                    type="text"
                    value={contactHandle}
                    onChange={e => setContactHandle(e.target.value)}
                    placeholder="@username"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--text)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '1px' }}>
                  DELIVERY ADDRESS *
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Full address for delivery"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--text)',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Order Summary */}
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '16px',
                marginTop: '8px',
              }}>
                <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '12px', letterSpacing: '1px' }}>
                  ORDER SUMMARY
                </div>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.quantity}x {item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>TOTAL</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: '700', color: 'var(--accent)' }}>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* SUCCESS VIEW */}
          {step === 'success' && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              gap: '16px',
            }}>
              <div style={{ fontSize: '64px' }}>🎉</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '2px' }}>
                ORDER PLACED!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '280px' }}>
                We received your order and will contact you soon to confirm.
              </p>
              <div style={{
                background: 'var(--card)',
                border: '1px solid var(--accent)',
                borderRadius: '12px',
                padding: '16px 32px',
                marginTop: '8px',
              }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: '700', color: 'var(--accent)' }}>
                  Order #{orderNumber}
                </span>
              </div>
              <button
                onClick={handleClose}
                style={{
                  marginTop: '16px',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, var(--accent), #7a3fff)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '1px',
                  cursor: 'pointer',
                }}
              >
                CONTINUE SHOPPING
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'cart' && items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                TOTAL
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => setStep('checkout')}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--accent-2), #00997f)',
                border: 'none',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,229,192,0.3)',
              }}
            >
              PROCEED TO CHECKOUT →
            </button>

            <button
              onClick={clearCart}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-dim)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '1px',
                cursor: 'pointer',
              }}
            >
              CLEAR CART
            </button>
          </div>
        )}

        {step === 'checkout' && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '8px',
                background: loading ? 'var(--bg-3)' : 'linear-gradient(135deg, var(--accent-2), #00997f)',
                border: 'none',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '1px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'PLACING ORDER...' : '✓ PLACE ORDER'}
            </button>

            <button
              onClick={() => { setStep('cart'); setError('') }}
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-dim)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '1px',
                cursor: 'pointer',
              }}
            >
              ← BACK TO CART
            </button>
          </div>
        )}
      </div>
    </>
  )
}
