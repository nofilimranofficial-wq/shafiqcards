import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { TEMPLATES } from '../data/webInviteTemplates';

const TemplatePreview = () => {
  const { templateId } = useParams();
  const template = TEMPLATES.find((t) => t.id === templateId);
  const [previewHtml, setPreviewHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const previewUrl = `${API_BASE_URL}/web-invitations/preview/${templateId}`;

  useEffect(() => {
    if (!template) return;

    const backendOrigin = API_BASE_URL.replace(/\/api\/?$/, '');
    const normalizeHtml = (html) => {
      let transformed = html.replace(/https?:\/\/localhost:5000/g, backendOrigin);
      const baseTag = `<base href="${backendOrigin}" />`;
      if (/\<base[^>]*\>/i.test(transformed)) {
        transformed = transformed.replace(/\<base[^>]*\>/i, baseTag);
      } else if (/\<head[^>]*\>/i.test(transformed)) {
        transformed = transformed.replace(/\<head([^>]*)\>/i, `<head$1>${baseTag}`);
      } else if (/\<html[^>]*\>/i.test(transformed)) {
        transformed = transformed.replace(/\<html([^>]*)\>/i, `<html$1><head>${baseTag}</head>`);
      } else {
        transformed = `${baseTag}${transformed}`;
      }
      return transformed;
    };

    const fetchPreviewHtml = async () => {
      try {
        setLoading(true);
        const res = await fetch(previewUrl);
        const text = await res.text();
        if (!res.ok) throw new Error('Unable to load preview page');
        setPreviewHtml(normalizeHtml(text));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreviewHtml();
  }, [template, previewUrl]);

  if (!template) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-20">
        <div className="max-w-xl rounded-[2rem] border border-slate-700 bg-slate-900 p-10 text-center shadow-2xl">
          <h1 className="text-3xl font-semibold mb-4">Invitation design not found</h1>
          <p className="text-slate-400 mb-8">The invitation design you are looking for does not exist. Please go back and choose another style.</p>
          <Link to="/web-invites" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#d4af37] to-[#c59d5f] px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg">
            Back to invitations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Original invitation preview</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950">{template.name}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">{template.description}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/web-invites" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50">
              Back to invitations
            </Link>
            <Link to={`/create-invitation?template=${template.id}`} className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#d4af37] to-[#c59d5f] px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg">
              Use this invitation
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-8xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-700 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl overflow-hidden">
          <div className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(197,157,95,0.16),_transparent_20%)]" />
            <div className="relative z-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Live demo invitation</p>
                <h2 className="mt-2 text-4xl font-semibold">Experience {template.name}</h2>
                <p className="mt-3 max-w-3xl text-sm text-slate-300">Your selected wedding invitation design is shown here as a full live preview. Scroll and interact with the real invitation page exactly as guests will see it.</p>
              </div>
              <div className="inline-flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/10 p-4 text-sm text-slate-200 backdrop-blur-sm">
                <span className="font-semibold text-white">Preview</span>
                <span>Full-page layout</span>
                <span>Mobile + desktop friendly</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 md:p-8">
            <div className="mx-auto max-w-[1600px] overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-950 shadow-2xl">
              <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900 px-4 py-3 text-slate-400">
                <span className="h-3 w-3 rounded-full bg-[#fb7185]" />
                <span className="h-3 w-3 rounded-full bg-[#fbbf24]" />
                <span className="h-3 w-3 rounded-full bg-[#34d399]" />
                <span className="text-xs uppercase tracking-[0.35em]">Preview frame</span>
              </div>
              <div className="h-[82vh] min-h-[680px] bg-slate-950">
                <iframe
                  src={previewUrl}
                  title={`Preview ${template.name}`}
                  className="h-full w-full border-0 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-950">What you are previewing</h3>
            <p className="mt-4 text-slate-600 leading-7">This preview loads your actual invitation design from the original Shafiqcards.com and applies demo wedding data so you can feel the real design.</p>
            <ul className="mt-6 space-y-3 text-slate-600">
              <li className="flex gap-3"><span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">✓</span> Clean original invitation layout</li>
              <li className="flex gap-3"><span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">✓</span> Demo guest details and event timings</li>
              <li className="flex gap-3"><span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">✓</span> Live HTML preview with real invitation assets</li>
            </ul>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-950">Invitation design details</h3>
            <div className="mt-5 space-y-4 text-slate-600">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Invitation design ID</p>
                <p className="mt-2 font-semibold text-slate-900">{template.id}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Source</p>
                <p className="mt-2 text-slate-600">ShafiqCards.com</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TemplatePreview;
