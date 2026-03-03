import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { title, artwork_type, materials, year } = await req.json()

    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const prompt = `Write a compelling, evocative artwork description for a virtual gallery listing.

Artwork details:
- Title: "${title}"
- Type: ${artwork_type || 'Unknown'}
- Materials: ${materials || 'Not specified'}
- Year: ${year || 'Contemporary'}

Write 2-3 sentences that:
1. Capture the emotional essence and visual mood of the work
2. Provide context about technique or medium when known
3. Invite the viewer to engage deeper with the piece

Be poetic but precise. Write in third person. Do not use clichés like "masterpiece" or "stunning".`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert art critic and gallery curator who writes concise, evocative artwork descriptions.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.75,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'OpenAI API error')
    }

    const data = await response.json()
    const description = data.choices[0]?.message?.content?.trim()

    return new Response(
      JSON.stringify({ description }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
