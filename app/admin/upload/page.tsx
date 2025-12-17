"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function AdminUploadPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [productSlug, setProductSlug] = useState("")
  const [products, setProducts] = useState<Array<{ slug: string; name: string }>>([])
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null
    setFile(f)
    if (f) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(f)
    } else {
      setPreview(null)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (res.ok) {
        setLoggedIn(true)
        setMessage(null)
      } else {
        const data = await res.json()
        setMessage(data.error || 'Invalid credentials')
      }
    } catch (err) {
      setMessage('Verification failed')
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !productSlug) {
      setMessage('Product slug and file required')
      return
    }

    setLoading(true)
    setMessage(null)

    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            password,
            productSlug,
            filename: file.name,
            data: dataUrl,
          }),
        })

        const data = await res.json()
        if (res.ok) {
          setMessage('Upload successful: ' + data.url)
          setPreview(data.url)
        } else {
          setMessage(data.error || 'Upload failed')
        }
      } catch (err) {
        setMessage('Upload failed')
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    if (!loggedIn) return
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products')
        if (!res.ok) return
        const data = await res.json()
        setProducts(data.products || [])
        if (data.products && data.products.length > 0) {
          setProductSlug(data.products[0].slug)
        }
      } catch (err) {
        console.error('Failed to load products', err)
      }
    }

    fetchProducts()
  }, [loggedIn])

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Image Upload</h1>

        {!loggedIn ? (
          <form onSubmit={handleLogin} className="space-y-4 max-w-md">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <Button type="submit">Login</Button>
            </div>
            {message && <p className="text-sm text-red-500">{message}</p>}
          </form>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="productSlug">Select Product</Label>
                {products.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No products available.</p>
                ) : (
                  <select
                    id="productSlug"
                    value={productSlug}
                    onChange={(e) => setProductSlug(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded bg-white"
                  >
                    {products.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name} — {p.slug}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <Label htmlFor="file">Image File</Label>
                <input id="file" type="file" accept="image/*" onChange={handleFileChange} />
              </div>

              {preview && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <div className="w-48 h-48 relative bg-muted overflow-hidden rounded">
                    {preview.startsWith('/uploads/') ? (
                      <Image src={preview} alt="preview" fill className="object-cover" />
                    ) : (
                      <img src={preview} alt="preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</Button>
                <Button variant="outline" onClick={() => { setLoggedIn(false); setUsername(''); setPassword(''); setMessage(null); }}>Logout</Button>
              </div>

              {message && <p className="text-sm mt-2">{message}</p>}
            </form>

            <div className="mt-6 text-sm text-muted-foreground">
              <p>Admin credentials are configured via environment variables: <code>ADMIN_USER</code> and <code>ADMIN_PASS</code>.</p>
              <p>Uploaded images are saved to <code>/public/uploads</code> and attached to the product's `images` array.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
